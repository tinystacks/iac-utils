import * as logger from '../../../../../logger';
import { EC2 } from '@aws-sdk/client-ec2';
import { ServiceQuotas } from '@aws-sdk/client-service-quotas';
import { ChangeType, IacFormat, ResourceDiffRecord, ResourceRecord, SmokeTestOptions, TfReference } from '../../../../../types';
import { getCredentials } from '../../../../../utils/aws';
import { QuotaError } from '../../../../../errors/quota-error';
import { ROUTE, ROUTE_TABLE_ASSOCIATION, SUBNET, VPC, getStandardResourceType } from '../resources';
import isNil from 'lodash.isnil';
import { CustomError } from '../../../../../errors';
import isEmpty from 'lodash.isempty';

async function checkVpcQuota (resources: ResourceDiffRecord[]) {
  const newVpcCount = resources.filter(resource =>
    getStandardResourceType(resource.resourceType) === VPC &&
    resource.changeType === ChangeType.CREATE
  ).length;

  if (newVpcCount === 0) return;

  logger.info('Checking VPC service quota...');
  const DEFAULT_VPC_QUOTA = 5;
  const DEFAULT_NUMBER_OF_VPCS = 1;

  const config = { credentials: await getCredentials() };

  const quotaClient = new ServiceQuotas(config);
  const quotaResponse = await quotaClient.getAWSDefaultServiceQuota({
    ServiceCode: 'vpc',
    QuotaCode: 'L-F678F1CE'
  });

  const vpcQuota = quotaResponse?.Quota?.Value || DEFAULT_VPC_QUOTA;

  const ec2Client = new EC2(config);
  const vpcResponse = await ec2Client.describeVpcs({});
  
  const currentNumberOfVpcs = vpcResponse?.Vpcs?.length || DEFAULT_NUMBER_OF_VPCS;
  const remainingNumberOfVpcs = vpcQuota - currentNumberOfVpcs;
  const proposedNumberOfVpcs = currentNumberOfVpcs + newVpcCount;
  if (vpcQuota < proposedNumberOfVpcs) {
    throw new QuotaError(`This stack needs to create ${newVpcCount} VPC(s), but only ${remainingNumberOfVpcs} more can be created with the current quota limit! Request a quota increase or choose another region to continue.`);
  }
}

// eslint-disable-next-line no-shadow
enum SubnetType {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
  ISOLATED = 'ISOLATED'
}

interface SubnetRecord {
  type: SubnetType;
  resourceRecord: ResourceRecord;
}

function getCdkSubnets (vpcResource: ResourceDiffRecord, allResources: ResourceDiffRecord[]): SubnetRecord[] {
  const { logicalId: vpcLogicalId } = vpcResource.resourceRecord;
  return allResources.filter((resource: ResourceDiffRecord) => 
    getStandardResourceType(resource.resourceType) === SUBNET &&
    resource.resourceRecord?.properties?.VpcId?.Ref === vpcLogicalId 
  ).map<SubnetRecord>((subnetResource: ResourceDiffRecord) => {
    const { logicalId: subnetLogicalId } = subnetResource.resourceRecord;
    
    const routeTableAssociation: ResourceDiffRecord = allResources.find((resource: ResourceDiffRecord) =>
      getStandardResourceType(resource.resourceType) === ROUTE_TABLE_ASSOCIATION &&
      resource.resourceRecord?.properties?.SubnetId?.Ref === subnetLogicalId
    );
    
    const routeTableId = routeTableAssociation?.resourceRecord?.properties?.RouteTableId?.Ref;
    const routes: ResourceDiffRecord[] = allResources.filter((resource: ResourceDiffRecord) =>
      getStandardResourceType(resource.resourceType) === ROUTE &&
      resource.resourceRecord?.properties?.RouteTableId?.Ref === routeTableId
    );
    
    const isPublic = routes?.some((route: ResourceDiffRecord) => route.resourceRecord?.properties?.DestinationCidrBlock === '0.0.0.0/0' && !isNil(route.resourceRecord?.properties?.GatewayId));
    const isPrivate = !isPublic && routes?.some((route: ResourceDiffRecord) => route.resourceRecord?.properties?.DestinationCidrBlock === '0.0.0.0/0' && !isNil(route.resourceRecord?.properties?.NatGatewayId));

    let subnetType = SubnetType.ISOLATED;
    if (isPublic) subnetType = SubnetType.PUBLIC;
    if (isPrivate) subnetType = SubnetType.PRIVATE;

    return {
      type: subnetType,
      resourceRecord: subnetResource.resourceRecord
    };
  });
}

function getTfSubnets (vpcResource: ResourceDiffRecord, allResources: ResourceDiffRecord[]): SubnetRecord[] {
  const { address: vpcAddress } = vpcResource.resourceRecord;
  return allResources.filter((resource: ResourceDiffRecord) => 
    getStandardResourceType(resource.resourceType) === SUBNET &&
    resource.resourceRecord?.tfReferences?.some(tfReference => tfReference.property === 'vpc_id' && tfReference.reference.startsWith(vpcAddress))
  ).map<SubnetRecord>((subnetResource: ResourceDiffRecord) => {
    const { address: subnetAddress, index } = subnetResource.resourceRecord;
    
    const nonIndexedSubnetAddress = !isEmpty(index) ? subnetAddress.replace(`["${index}"]`, '') : subnetAddress;
    const routeTableAssociation: ResourceDiffRecord = allResources.filter((resource: ResourceDiffRecord) =>
      getStandardResourceType(resource.resourceType) === ROUTE_TABLE_ASSOCIATION
    ).find((resource: ResourceDiffRecord) => {  
      const directReference = resource.resourceRecord?.tfReferences?.find((tfReference: TfReference) => 
        tfReference.property === 'subnet_id' &&
        tfReference.reference === nonIndexedSubnetAddress
      ) || false;

      const loopedReference = resource.resourceRecord?.tfReferences?.find((tfReference: TfReference) => 
        tfReference.property === 'subnet_id' &&
        tfReference.reference === 'each.value'
      ) || false;
      const forEachReference = resource.resourceRecord?.tfReferences?.find((tfReference: TfReference) => 
        tfReference.property === 'for_each' &&
        tfReference.reference === nonIndexedSubnetAddress
      ) || false;

      return directReference || (loopedReference && forEachReference);
    });
    
    const routeTableIdReference = routeTableAssociation?.resourceRecord?.tfReferences?.find((tfReference: TfReference) => 
      tfReference.property === 'route_table_id' &&
      (
        tfReference.reference.startsWith('aws_route_table.') ||
        (
          tfReference.reference.startsWith('module.') &&
          tfReference.reference.includes('.aws_route_table.')
        )
      )
    )?.reference;
    const routeTableId = routeTableIdReference?.endsWith('.id') ? routeTableIdReference?.substring(0, routeTableIdReference?.length - 3) : routeTableIdReference;

    const routes: ResourceDiffRecord[] = allResources.filter((resource: ResourceDiffRecord) =>
      getStandardResourceType(resource.resourceType) === ROUTE &&
      resource.resourceRecord?.tfReferences?.some((tfReference: TfReference) => 
        tfReference.property === 'route_table_id' &&
        tfReference.reference === routeTableId
      )
    );
    
    const isPublic = routes?.some((route: ResourceDiffRecord) => {
      const hasGatewayId = route.resourceRecord?.tfReferences?.find((tfReference: TfReference) => tfReference.property === 'gateway_id') || false;
      const hasInternetDestination = route.resourceRecord?.properties?.destination_cidr_block === '0.0.0.0/0';
      return hasGatewayId && hasInternetDestination;
    });

    const isPrivate = routes?.some((route: ResourceDiffRecord) => {
      const hasNatGatewayId = route.resourceRecord?.tfReferences?.find((tfReference: TfReference) => tfReference.property === 'nat_gateway_id') || false;
      const hasInternetDestination = route.resourceRecord?.properties?.destination_cidr_block === '0.0.0.0/0';
      return hasNatGatewayId && hasInternetDestination;
    });

    let subnetType = SubnetType.ISOLATED;
    if (isPublic) subnetType = SubnetType.PUBLIC;
    if (isPrivate) subnetType = SubnetType.PRIVATE;

    return {
      type: subnetType,
      resourceRecord: subnetResource.resourceRecord
    };
  });
}

function getSubnetsForVpc (resource: ResourceDiffRecord, allResources: ResourceDiffRecord[]): SubnetRecord[] {
  const { format } = resource;
  switch (format) {
    case IacFormat.awsCdk:
      return getCdkSubnets(resource, allResources);
    case IacFormat.tf:
      return getTfSubnets(resource, allResources);
    default:
      return [];
  }
}

async function verifyVpcHasPrivateSubnets (resource: ResourceDiffRecord, allResources: ResourceDiffRecord[]) {
  logger.info('Verifying subnet configuration...');
  const subnets = getSubnetsForVpc(resource, allResources);
  const privateSubnets = subnets.filter((subnet: SubnetRecord) => subnet.type === SubnetType.PRIVATE);
  if (privateSubnets.length === 0) {
    throw new CustomError('Missing private subnets!', `Based on the configuration passed, private subnets with a NAT Gateway are required for all vpcs but none was found for "${resource.resourceRecord?.logicalId}".`);
  }
}

async function vpcSmokeTest (resource: ResourceDiffRecord, allResources: ResourceDiffRecord[], config: SmokeTestOptions) {
  if (config.requirePrivateSubnet) {
    await verifyVpcHasPrivateSubnets(resource, allResources);
  }
}


export {
  checkVpcQuota,
  vpcSmokeTest
};
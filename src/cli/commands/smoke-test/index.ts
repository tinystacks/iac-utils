import { AWS_TF_PROVIDER_NAME } from '../../constants';
import * as logger from '../../logger';
import { IacFormat, ResourceDiffRecord, SmokeTestOptions } from '../../types';
import { detectIacFormat } from './detect-iac-format';
import { prepareForSmokeTest } from './prepare';
import { checkAwsQuotas, smokeTestAwsResource } from './smoke-tests';
import { getStandardResourceType } from './smoke-tests/aws/resources';

async function smokeTestResource (resource: ResourceDiffRecord, format: IacFormat, allResources: ResourceDiffRecord[]) {
  const isAwsResource = format === IacFormat.awsCdk || (format === IacFormat.tf && resource.resourceRecord.tfProviderName === AWS_TF_PROVIDER_NAME);
  if (isAwsResource) return smokeTestAwsResource(resource, allResources);
}

interface ResourceGroup {
  [key: string]: ResourceDiffRecord[]
}

async function checkQuotas (allResources: ResourceDiffRecord[]) {
  const groupedByType: ResourceGroup = allResources.reduce<ResourceGroup>((acc: ResourceGroup, resource: ResourceDiffRecord) => {
    const resourceType = getStandardResourceType(resource.resourceType);
    acc[resourceType] = acc[resourceType] || [];
    acc[resourceType].push(resource);
    return acc;
  }, {});
  const resourceGroups = Object.entries(groupedByType);
  for (const [resourceType, resources] of resourceGroups) {
    const {
      format,
      resourceRecord
    } = resources.at(0) || {};
    const isAwsResourceType = format === IacFormat.awsCdk || (format === IacFormat.tf && resourceRecord.tfProviderName === AWS_TF_PROVIDER_NAME);
    if (isAwsResourceType) await checkAwsQuotas(resourceType, resources);
  }
}

async function smokeTest (options: SmokeTestOptions) {
  let { format } = options;
  if (!format) {
    format = detectIacFormat();
    logger.info(`No IaC format specified. Using detected format: ${format}`);
  }

  const resourceDiffRecords = await prepareForSmokeTest(format);
  await checkQuotas(resourceDiffRecords);
  for (const resource of resourceDiffRecords) {
    await smokeTestResource(resource, format, resourceDiffRecords);
  }
  logger.success('Smoke test passed!');
}

export {
  smokeTest
};
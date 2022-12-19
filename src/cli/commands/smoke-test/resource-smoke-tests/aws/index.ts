import { ResourceDiffRecord } from '../../../../types';
import {
  SQS_QUEUE,
  S3_BUCKET,
  getStandardResourceType,
  VPC,
  NAT_GATEWAY
} from './resources';
import {
  s3BucketSmokeTest,
  sqsQueueSmokeTest
} from './smoke-tests';
import { natGatewaySmokeTest } from './smoke-tests/nat-gateway-smoke-tests';
import { vpcSmokeTest } from './smoke-tests/vpc-smoke-tests';

const smokeTests: {
  [key: string]: (resource: ResourceDiffRecord, allResources: ResourceDiffRecord[]) => Promise<void>
} = {
  [SQS_QUEUE]: sqsQueueSmokeTest,
  [S3_BUCKET]: s3BucketSmokeTest,
  [VPC]: vpcSmokeTest,
  [NAT_GATEWAY]: natGatewaySmokeTest
};

async function smokeTestAwsResource (resource: ResourceDiffRecord, allResources: ResourceDiffRecord[]) {
  const resourceType = getStandardResourceType(resource.resourceType);
  const smokeTest = smokeTests[resourceType];
  if (smokeTest) return smokeTest(resource, allResources);
}

export {
  smokeTestAwsResource
};
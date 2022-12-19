import { ResourceDiffRecord } from '../../../../types';
import {
  SQS_QUEUE,
  S3_BUCKET,
  getStandardResourceType,
  VPC
} from './resources';
import {
  s3BucketSmokeTest,
  sqsQueueSmokeTest
} from './smoke-tests';
import { vpcSmokeTest } from './smoke-tests/vpc-smoke-tests';

const smokeTests: {
  [key: string]: (resource: ResourceDiffRecord, allResources: ResourceDiffRecord[]) => Promise<void>
} = {
  [SQS_QUEUE]: sqsQueueSmokeTest,
  [S3_BUCKET]: s3BucketSmokeTest,
  [VPC]: vpcSmokeTest
};

async function smokeTestAwsResource (resource: ResourceDiffRecord, allResources: ResourceDiffRecord[]) {
  const resourceType = getStandardResourceType(resource.resourceType);
  const smokeTest = smokeTests[resourceType];
  return smokeTest(resource, allResources);
}

export {
  smokeTestAwsResource
};
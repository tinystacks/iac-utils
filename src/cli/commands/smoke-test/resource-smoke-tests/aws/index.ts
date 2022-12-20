import { ResourceDiffRecord } from '../../../../types';
import {
  SQS_QUEUE,
  S3_BUCKET,
  getStandardResourceType,
  VPC,
  EIP
} from './resources';
import {
  s3BucketSmokeTest,
  sqsQueueSmokeTest,
  vpcSmokeTest,
  eipSmokeTest
} from './smoke-tests';

const smokeTests: {
  [key: string]: (resource: ResourceDiffRecord, allResources: ResourceDiffRecord[]) => Promise<void>
} = {
  [SQS_QUEUE]: sqsQueueSmokeTest,
  [S3_BUCKET]: s3BucketSmokeTest,
  [VPC]: vpcSmokeTest,
  [EIP]: eipSmokeTest
};

async function smokeTestAwsResource (resource: ResourceDiffRecord, allResources: ResourceDiffRecord[]) {
  const resourceType = getStandardResourceType(resource.resourceType);
  const smokeTest = smokeTests[resourceType];
  if (smokeTest) return smokeTest(resource, allResources);
}

export {
  smokeTestAwsResource
};
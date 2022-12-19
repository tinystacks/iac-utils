import { ResourceDiffRecord } from '../../../../types';
import {
  SQS_QUEUE,
  S3_BUCKET,
  getStandardResourceType
} from './resources';
import {
  s3BucketSmokeTest,
  sqsQueueSmokeTest
} from './smoke-tests';

const smokeTests: {
  [key: string]: (resource: ResourceDiffRecord) => Promise<void>
} = {
  [SQS_QUEUE]: sqsQueueSmokeTest,
  [S3_BUCKET]: s3BucketSmokeTest
};

async function smokeTestAwsResource (resource: ResourceDiffRecord) {
  const resourceType = getStandardResourceType(resource.resourceType);
  const smokeTest = smokeTests[resourceType];
  return smokeTest(resource);
}

export {
  smokeTestAwsResource
};
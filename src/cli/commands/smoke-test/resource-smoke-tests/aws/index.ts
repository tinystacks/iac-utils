import { ResourceDiffRecord } from '../../../../types';
import {
  SQS_QUEUE,
  getStandardResourceType
} from './resources';
import {
  sqsQueueSmokeTest
} from './smoke-tests';

const smokeTests: {
  [key: string]: (resource: ResourceDiffRecord) => Promise<void>
} = {
  [SQS_QUEUE]: sqsQueueSmokeTest
};

async function smokeTestAwsResource (resource: ResourceDiffRecord) {
  const resourceType = getStandardResourceType(resource.resourceType);
  const smokeTest = smokeTests[resourceType];
  return smokeTest(resource);
}

export {
  smokeTestAwsResource
};
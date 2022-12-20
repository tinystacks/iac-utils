const mockSqsQueueSmokeTest = jest.fn();

jest.mock('../../../../../../src/cli/commands/smoke-test/smoke-tests/aws/resource-tests', () => ({
  sqsQueueSmokeTest: mockSqsQueueSmokeTest
}));

import { smokeTestAwsResource } from '../../../../../../src/cli/commands/smoke-test/smoke-tests/aws';
import { ResourceDiffRecord } from '../../../../../../src/cli/types';

test('smokeTestAwsResource', async () => {
  const mockResource = {
    resourceType: 'AWS::SQS::Queue'
  } as ResourceDiffRecord;
  
  await smokeTestAwsResource(mockResource, [mockResource]);

  expect(mockSqsQueueSmokeTest).toBeCalled();
});
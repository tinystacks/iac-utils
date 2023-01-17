const mockLoggerInfo = jest.fn();
const mockLoggerSuccess = jest.fn();
const mockDetectIacFormat = jest.fn();
const mockPrepareForSmokeTest = jest.fn();
const mockSmokeTestAwsResource = jest.fn();
const mockCheckAwsQuotas = jest.fn();

jest.mock('../../../../src/cli/logger', () => ({
  info: mockLoggerInfo,
  success: mockLoggerSuccess
}));

jest.mock('../../../../src/cli/commands/smoke-test/detect-iac-format.ts', () => ({
  detectIacFormat: mockDetectIacFormat
}));

jest.mock('../../../../src/cli/commands/smoke-test/prepare.ts', () => ({
  prepareForSmokeTest: mockPrepareForSmokeTest
}));

jest.mock('../../../../src/cli/commands/smoke-test/smoke-tests', () => ({
  testAwsResource: mockSmokeTestAwsResource,
  checkAwsQuotas: mockCheckAwsQuotas
}));

import { smokeTest } from '../../../../src/cli/commands/smoke-test';
import { SQS_QUEUE, VPC } from '../../../../src/cli/commands/smoke-test/smoke-tests/aws/resources';
import { ChangeType, IacFormat } from '../../../../src/cli/types';

describe('smokeTest', () => {
  afterEach(() => {
    // for mocks
    jest.resetAllMocks();
    // for spies
    jest.restoreAllMocks();
  });

  it('detects IaC format if not passed', async () => {
    mockDetectIacFormat.mockReturnValueOnce('mock-format');
    mockPrepareForSmokeTest.mockResolvedValueOnce([]); // Because we don't care about the calls after this point

    await smokeTest({});

    expect(mockDetectIacFormat).toBeCalled();
    expect(mockLoggerInfo).toBeCalledWith('No IaC format specified. Using detected format: mock-format');
    expect(mockPrepareForSmokeTest).toBeCalledWith({ format: 'mock-format' });
  });
  it('runs smoke test on each resource returned', async () => {
    const mockSqs = {
      stackName: 'mock-stack',
      format: IacFormat.awsCdk,
      resourceType: 'AWS::SQS::Queue',
      changeType: ChangeType.CREATE,
      resourceRecord: {}
    };
    const mockVpc = {
      stackName: 'mock-stack',
      format: IacFormat.awsCdk,
      resourceType: 'AWS::EC2::VPC',
      changeType: ChangeType.CREATE,
      resourceRecord: {}
    };
    mockDetectIacFormat.mockReturnValueOnce('mock-format');
    mockPrepareForSmokeTest.mockResolvedValueOnce([
      mockSqs,
      mockVpc
    ]);

    const mockConfig = { format: IacFormat.awsCdk };
    await smokeTest(mockConfig);

    expect(mockDetectIacFormat).not.toBeCalled();
    expect(mockLoggerInfo).not.toBeCalled();
    expect(mockPrepareForSmokeTest).toBeCalledWith(mockConfig);
    expect(mockSmokeTestAwsResource).toBeCalledTimes(2);
    expect(mockSmokeTestAwsResource).toBeCalledWith(mockSqs, [mockSqs, mockVpc], mockConfig);
    expect(mockSmokeTestAwsResource).toBeCalledWith(mockVpc, [mockSqs, mockVpc], mockConfig);
    expect(mockCheckAwsQuotas).toBeCalledTimes(2);
    expect(mockCheckAwsQuotas).toBeCalledWith(SQS_QUEUE, [mockSqs], mockConfig);
    expect(mockCheckAwsQuotas).toBeCalledWith(VPC, [mockVpc], mockConfig);
    expect(mockLoggerSuccess).toBeCalledWith('Smoke test passed!');
  });
});
const mockLoggerInfo = jest.fn();
const mockGetCredentials = jest.fn();
const mockDescribeVpcs = jest.fn();
const mockEc2 = jest.fn();
const mockGetAwsDefaultServiceQuota = jest.fn();
const mockServiceQuotas = jest.fn();

jest.mock('../../../../../../../src/cli/logger', () => ({
  info: mockLoggerInfo
}));

jest.mock('../../../../../../../src/cli/utils/aws', () => ({
  getCredentials: mockGetCredentials
}));

jest.mock('@aws-sdk/client-ec2', () => ({
  __esModule: true,
  EC2: mockEc2
}));

jest.mock('@aws-sdk/client-service-quotas', () => ({
  __esModule: true,
  ServiceQuotas: mockServiceQuotas
}));

import {
  ChangeType, IacFormat, ResourceDiffRecord
} from '../../../../../../../src/cli/types';
import {
  vpcSmokeTest
} from '../../../../../../../src/cli/commands/smoke-test/resource-smoke-tests/aws/smoke-tests';

describe('vpc smoke tests', () => {
  beforeEach(() => {
    mockEc2.mockReturnValue({
      describeVpcs: mockDescribeVpcs
    });
    mockServiceQuotas.mockReturnValue({
      getAWSDefaultServiceQuota: mockGetAwsDefaultServiceQuota
    });
  });

  afterEach(() => {
    // for mocks
    jest.resetAllMocks();
    // for spies
    jest.restoreAllMocks();
  });

  describe('vpcSmokeTest', () => {
    it('does nothing if change type is not create', async () => {
      const resource = {
        changeType: ChangeType.UPDATE
      } as ResourceDiffRecord;

      await vpcSmokeTest(resource, [resource]);

      expect(mockLoggerInfo).not.toBeCalled();
      expect(mockGetCredentials).not.toBeCalled();
      expect(mockServiceQuotas).not.toBeCalled();
      expect(mockGetAwsDefaultServiceQuota).not.toBeCalled();
      expect(mockEc2).not.toBeCalled();
      expect(mockDescribeVpcs).not.toBeCalled();
    });
    it('validates quota would not be exceeded if change type is create', async () => {
      const resource = {
        changeType: ChangeType.CREATE,
        format: IacFormat.awsCdk,
        resourceType: 'AWS::EC2::VPC',
        resourceRecord: {
          properties: {}
        }
      } as unknown as ResourceDiffRecord;

      mockGetAwsDefaultServiceQuota.mockResolvedValueOnce({
        Quota: {
          Value: 5
        }
      });
      mockDescribeVpcs.mockResolvedValueOnce({
        Vpcs: Array(2)
      });
      

      await vpcSmokeTest(resource, [resource, resource]);

      expect(mockLoggerInfo).toBeCalled();
      expect(mockLoggerInfo).toBeCalledWith('Checking VPC service quota...');
      expect(mockGetCredentials).toBeCalled();
      expect(mockGetAwsDefaultServiceQuota).toBeCalled();
      expect(mockDescribeVpcs).toBeCalled();
    });
    it('throws a QuotaError if new vpc would exceed quota limit', async () => {
      const resource = {
        changeType: ChangeType.CREATE,
        format: IacFormat.tf,
        resourceType: 'aws_vpc',
        resourceRecord: {
          properties: {}
        }
      } as unknown as ResourceDiffRecord;
      
      mockGetAwsDefaultServiceQuota.mockResolvedValueOnce({
        Quota: {
          Value: 5
        }
      });
      mockDescribeVpcs.mockResolvedValueOnce({
        Vpcs: Array(5)
      });

      let thrownError;
      try {
        await vpcSmokeTest(resource, [resource]);
      } catch (error) {
        thrownError = error;
      } finally {
        expect(mockLoggerInfo).toBeCalled();
        expect(mockLoggerInfo).toBeCalledWith('Checking VPC service quota...');
        expect(mockGetCredentials).toBeCalled();
        expect(mockGetAwsDefaultServiceQuota).toBeCalled();
        expect(mockDescribeVpcs).toBeCalled();

        expect(thrownError).not.toBeUndefined();
        expect(thrownError).toHaveProperty('name', 'CustomError');
        expect(thrownError).toHaveProperty('message', 'Quota Limit Reached!');
        expect(thrownError).toHaveProperty('reason', 'This stack needs to create 1 VPC(s), but only 0 more can be created with the current quota limit! Request a quota increase or choose another region to continue.');
      }
    });
  });
});
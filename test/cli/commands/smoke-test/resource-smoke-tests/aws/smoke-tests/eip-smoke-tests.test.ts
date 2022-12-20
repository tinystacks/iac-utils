const mockLoggerInfo = jest.fn();
const mockGetCredentials = jest.fn();
const mockDescribeAddresses = jest.fn();
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
  eipSmokeTest
} from '../../../../../../../src/cli/commands/smoke-test/resource-smoke-tests/aws/smoke-tests';

describe('eip smoke tests', () => {
  beforeEach(() => {
    mockEc2.mockReturnValue({
      describeAddresses: mockDescribeAddresses
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

  describe('eipSmokeTest', () => {
    it('does nothing if change type is not create', async () => {
      const resource = {
        changeType: ChangeType.UPDATE
      } as ResourceDiffRecord;

      await eipSmokeTest(resource, [resource]);

      expect(mockLoggerInfo).not.toBeCalled();
      expect(mockGetCredentials).not.toBeCalled();
      expect(mockServiceQuotas).not.toBeCalled();
      expect(mockGetAwsDefaultServiceQuota).not.toBeCalled();
      expect(mockEc2).not.toBeCalled();
      expect(mockDescribeAddresses).not.toBeCalled();
    });
    it('validates quota would not be exceeded if change type is create', async () => {
      const resource = {
        changeType: ChangeType.CREATE,
        format: IacFormat.awsCdk,
        resourceType: 'AWS::EC2::EIP',
        resourceRecord: {
          properties: {}
        }
      } as unknown as ResourceDiffRecord;

      mockGetAwsDefaultServiceQuota.mockResolvedValueOnce({
        Quota: {
          Value: 5
        }
      });
      mockDescribeAddresses.mockResolvedValueOnce({
        Addresses: Array(2)
      });
      

      await eipSmokeTest(resource, [resource, resource]);

      expect(mockLoggerInfo).toBeCalled();
      expect(mockLoggerInfo).toBeCalledWith('Checking Elastic IP service quota...');
      expect(mockGetCredentials).toBeCalled();
      expect(mockGetAwsDefaultServiceQuota).toBeCalled();
      expect(mockDescribeAddresses).toBeCalled();
    });
    it('throws a QuotaError if new eip would exceed quota limit', async () => {
      const resource = {
        changeType: ChangeType.CREATE,
        format: IacFormat.tf,
        resourceType: 'aws_eip',
        resourceRecord: {
          properties: {}
        }
      } as unknown as ResourceDiffRecord;
      
      mockGetAwsDefaultServiceQuota.mockResolvedValueOnce({
        Quota: {
          Value: 5
        }
      });
      mockDescribeAddresses.mockResolvedValueOnce({
        Addresses: Array(5)
      });

      let thrownError;
      try {
        await eipSmokeTest(resource, [resource]);
      } catch (error) {
        thrownError = error;
      } finally {
        expect(mockLoggerInfo).toBeCalled();
        expect(mockLoggerInfo).toBeCalledWith('Checking Elastic IP service quota...');
        expect(mockGetCredentials).toBeCalled();
        expect(mockGetAwsDefaultServiceQuota).toBeCalled();
        expect(mockDescribeAddresses).toBeCalled();

        expect(thrownError).not.toBeUndefined();
        expect(thrownError).toHaveProperty('name', 'CustomError');
        expect(thrownError).toHaveProperty('message', 'Quota Limit Reached!');
        expect(thrownError).toHaveProperty('reason', 'This stack needs to create 1 elastic IP address(es), but only 0 more can be created within this region with the current quota limit! Release any unassociated EIPs, request a quota increase, or choose another region to continue.');
      }
    });
  });
});
const mockLoggerInfo = jest.fn();
const mockGetCredentials = jest.fn();
const mockListBuckets = jest.fn();
const mockHeadBucket = jest.fn();
const mockS3 = jest.fn();
const mockGetAwsDefaultServiceQuota = jest.fn();
const mockServiceQuotas = jest.fn();

jest.mock('../../../../../../../src/cli/logger', () => ({
  info: mockLoggerInfo
}));

jest.mock('../../../../../../../src/cli/utils/aws', () => ({
  getCredentials: mockGetCredentials
}));

jest.mock('@aws-sdk/client-s3', () => ({
  __esModule: true,
  S3: mockS3
}));

jest.mock('@aws-sdk/client-service-quotas', () => ({
  __esModule: true,
  ServiceQuotas: mockServiceQuotas
}));

import {
  ChangeType, IacFormat, ResourceDiffRecord
} from '../../../../../../../src/cli/types';
import {
  s3BucketSmokeTest
} from '../../../../../../../src/cli/commands/smoke-test/resource-smoke-tests/aws/smoke-tests';

describe('s3 smoke tests', () => {
  beforeEach(() => {
    mockS3.mockReturnValue({
      listBuckets: mockListBuckets,
      headBucket: mockHeadBucket
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

  describe('s3BucketSmokeTest', () => {
    it('does nothing if change type is not create', async () => {
      const resource = {
        changeType: ChangeType.UPDATE
      } as ResourceDiffRecord;

      await s3BucketSmokeTest(resource);

      expect(mockLoggerInfo).not.toBeCalled();
      expect(mockGetCredentials).not.toBeCalled();
      expect(mockS3).not.toBeCalled();
      expect(mockListBuckets).not.toBeCalled();
      expect(mockHeadBucket).not.toBeCalled();
    });
    it('validates quota would not be exceeded and bucket name is unique if change type is create', async () => {
      const resource = {
        changeType: ChangeType.CREATE,
        format: IacFormat.awsCdk,
        resourceRecord: {
          properties: {
            BucketName: 'mock-bucket'
          }
        }
      } as unknown as ResourceDiffRecord;

      mockGetAwsDefaultServiceQuota.mockResolvedValueOnce({
        Quota: {
          Value: 100
        }
      });
      mockListBuckets.mockResolvedValueOnce({
        Buckets: Array(99)
      });
      mockHeadBucket.mockRejectedValueOnce({
        '$metadata': {
          httpStatusCode: 404
        }
      });

      await s3BucketSmokeTest(resource);

      expect(mockLoggerInfo).toBeCalledTimes(2);
      expect(mockLoggerInfo).toBeCalledWith('Checking S3 bucket service quota...');
      expect(mockLoggerInfo).toBeCalledWith('Checking if S3 bucket name mock-bucket is unique...');
      expect(mockGetCredentials).toBeCalled();
      expect(mockGetAwsDefaultServiceQuota).toBeCalled();
      expect(mockListBuckets).toBeCalled();
      expect(mockHeadBucket).toBeCalled();
      expect(mockHeadBucket).toBeCalledWith({
        Bucket: 'mock-bucket'
      });
    });
    it('throws a QuotaError if new bucket would exceed quota limit', async () => {
      const resource = {
        changeType: ChangeType.CREATE,
        format: IacFormat.tf,
        resourceRecord: {
          properties: {
            bucket: 'mock-bucket'
          }
        }
      } as unknown as ResourceDiffRecord;
      
      mockGetAwsDefaultServiceQuota.mockResolvedValueOnce({
        Quota: {
          Value: 100
        }
      });
      mockListBuckets.mockResolvedValueOnce({
        Buckets: Array(100)
      });

      let thrownError;
      try {
        await s3BucketSmokeTest(resource);
      } catch (error) {
        thrownError = error;
      } finally {
        expect(mockLoggerInfo).toBeCalledTimes(1);
        expect(mockLoggerInfo).toBeCalledWith('Checking S3 bucket service quota...');
        expect(mockGetCredentials).toBeCalled();
        expect(mockGetAwsDefaultServiceQuota).toBeCalled();
        expect(mockListBuckets).toBeCalled();
        expect(mockHeadBucket).not.toBeCalled();

        expect(thrownError).not.toBeUndefined();
        expect(thrownError).toHaveProperty('name', 'CustomError');
        expect(thrownError).toHaveProperty('message', 'Quota Limit Reached!');
        expect(thrownError).toHaveProperty('reason', 'Your AWS account is already using the max bucket count of 100, which is the S3 quota for your region.');
      }
    });
    it('throws a ConflictError if user already has a bucket with the same name', async () => {
      const resource = {
        changeType: ChangeType.CREATE,
        format: IacFormat.awsCdk,
        resourceRecord: {
          properties: {
            BucketName: 'mock-bucket'
          }
        }
      } as unknown as ResourceDiffRecord;
      
      mockGetAwsDefaultServiceQuota.mockResolvedValueOnce({
        Quota: {
          Value: 100
        }
      });
      mockListBuckets.mockResolvedValueOnce({
        Buckets: Array(99)
      });
      mockHeadBucket.mockResolvedValueOnce({});

      let thrownError;
      try {
        await s3BucketSmokeTest(resource);
      } catch (error) {
        thrownError = error;
      } finally {
        expect(mockLoggerInfo).toBeCalledTimes(2);
        expect(mockLoggerInfo).toBeCalledWith('Checking S3 bucket service quota...');
        expect(mockLoggerInfo).toBeCalledWith('Checking if S3 bucket name mock-bucket is unique...');
        expect(mockGetCredentials).toBeCalled();
        expect(mockGetAwsDefaultServiceQuota).toBeCalled();
        expect(mockListBuckets).toBeCalled();
        expect(mockHeadBucket).toBeCalled();
        expect(mockHeadBucket).toBeCalledWith({
          Bucket: 'mock-bucket'
        });

        expect(thrownError).not.toBeUndefined();
        expect(thrownError).toHaveProperty('name', 'CustomError');
        expect(thrownError).toHaveProperty('message', 'Conflict!');
        expect(thrownError).toHaveProperty('reason', 'An S3 bucket with name mock-bucket already exists!');
      }
    });
    it('throws a ConflictError if the bucket name is not globally unique', async () => {
      const resource = {
        changeType: ChangeType.CREATE,
        format: IacFormat.awsCdk,
        resourceRecord: {
          properties: {
            BucketName: 'mock-bucket'
          }
        }
      } as unknown as ResourceDiffRecord;
      
      mockGetAwsDefaultServiceQuota.mockResolvedValueOnce({
        Quota: {
          Value: 100
        }
      });
      mockListBuckets.mockResolvedValueOnce({
        Buckets: Array(99)
      });
      mockHeadBucket.mockRejectedValueOnce({
        '$metadata': {
          httpStatusCode: 403
        }
      });

      let thrownError;
      try {
        await s3BucketSmokeTest(resource);
      } catch (error) {
        thrownError = error;
      } finally {
        expect(mockLoggerInfo).toBeCalledTimes(2);
        expect(mockLoggerInfo).toBeCalledWith('Checking S3 bucket service quota...');
        expect(mockLoggerInfo).toBeCalledWith('Checking if S3 bucket name mock-bucket is unique...');
        expect(mockGetCredentials).toBeCalled();
        expect(mockGetAwsDefaultServiceQuota).toBeCalled();
        expect(mockListBuckets).toBeCalled();
        expect(mockHeadBucket).toBeCalled();
        expect(mockHeadBucket).toBeCalledWith({
          Bucket: 'mock-bucket'
        });

        expect(thrownError).not.toBeUndefined();
        expect(thrownError).toHaveProperty('name', 'CustomError');
        expect(thrownError).toHaveProperty('message', 'Conflict!');
        expect(thrownError).toHaveProperty('reason', 'An S3 bucket with name mock-bucket already exists!');
      }
    });
    it('does not validate bucket name if it is undefined/defaulted', async () => {
      const resource = {
        changeType: ChangeType.CREATE,
        format: IacFormat.awsCdk,
        resourceRecord: {
          properties: {}
        }
      } as unknown as ResourceDiffRecord;

      mockGetAwsDefaultServiceQuota.mockResolvedValueOnce({
        Quota: {
          Value: 100
        }
      });
      mockListBuckets.mockResolvedValueOnce({
        Buckets: Array(99)
      });

      await s3BucketSmokeTest(resource);

      expect(mockLoggerInfo).toBeCalledTimes(1);
      expect(mockLoggerInfo).toBeCalledWith('Checking S3 bucket service quota...');
      expect(mockGetCredentials).toBeCalled();
      expect(mockGetAwsDefaultServiceQuota).toBeCalled();
      expect(mockListBuckets).toBeCalled();
      expect(mockHeadBucket).not.toBeCalled();
    });
  });
});
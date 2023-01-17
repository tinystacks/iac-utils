import * as logger from '../../../../../logger';
import { S3 } from '@aws-sdk/client-s3';
import { ConflictError } from '../../../../../errors';
import { ChangeType, ResourceDiffRecord, SmokeTestOptions } from '../../../../../types';
import { getCredentials } from '../../../../../utils/aws';

async function validateBucketNameIsUnique (bucketName: string) {
  logger.info(`Checking if S3 bucket name ${bucketName} is unique...`);
  const s3Client = new S3({
    credentials: await getCredentials()
  });

  let error;
  try {
    await s3Client.headBucket({
      Bucket: bucketName
    });
  } catch (err) {
    error = err as any;
  }

  if (!error || error?.$metadata?.httpStatusCode === 403) {
    throw new ConflictError(`An S3 bucket with name ${bucketName} already exists!`);
  } else if (error.$metadata?.httpStatusCode !== 404) {
    throw error;
  }
}

async function s3BucketSmokeTest (resource: ResourceDiffRecord, _allResources?: ResourceDiffRecord[], _config?: SmokeTestOptions) {
  if (resource.changeType === ChangeType.CREATE) {
    if (resource.properties?.Name) await validateBucketNameIsUnique(resource.properties?.Name);
  }
}

export {
  s3BucketSmokeTest
};
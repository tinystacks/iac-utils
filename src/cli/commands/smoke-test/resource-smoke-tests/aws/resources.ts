import { Json } from '../../../../types';

// Standard Types
const SQS_QUEUE = 'SQS_QUEUE';
const S3_BUCKET = 'S3_BUCKET';

// Cloudformation Types
const CFN_SQS_QUEUE = 'AWS::SQS::Queue';
const CFN_S3_BUCKET = 'AWS::S3::Bucket';

// Terraform Types
const TF_SQS_QUEUE = 'aws_sqs_queue';
const TF_S3_BUCKET = 'aws_s3_bucket';

const resourceTypeMap: Json = {
  [CFN_SQS_QUEUE]: SQS_QUEUE,
  [TF_SQS_QUEUE]: SQS_QUEUE,
  [CFN_S3_BUCKET]: S3_BUCKET,
  [TF_S3_BUCKET]: S3_BUCKET
};

function getStandardResourceType (type: string): string {
  return resourceTypeMap[type];
}

export {
  SQS_QUEUE,
  S3_BUCKET,
  getStandardResourceType
};
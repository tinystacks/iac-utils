import { Json } from '../../../../types';

// Standard Types
const SQS_QUEUE = 'SQS_QUEUE';

// Cloudformation Types
const CFN_SQS_QUEUE = 'AWS::SQS::Queue';

// Terraform Types
const TF_SQS_QUEUE = 'aws_sqs_queue';

const resourceTypeMap: Json = {
  [CFN_SQS_QUEUE]: SQS_QUEUE,
  [TF_SQS_QUEUE]: SQS_QUEUE
};

function getStandardResourceType (type: string): string {
  return resourceTypeMap[type];
}

export {
  SQS_QUEUE,
  getStandardResourceType
};
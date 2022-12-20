import { Json } from '../../../../types';

// Standard Types
const SQS_QUEUE = 'SQS_QUEUE';
const S3_BUCKET = 'S3_BUCKET';
const VPC = 'VPC';
const NAT_GATEWAY = 'NAT_GATEWAY';
const EIP = 'EIP';

// Cloudformation Types
const CFN_SQS_QUEUE = 'AWS::SQS::Queue';
const CFN_S3_BUCKET = 'AWS::S3::Bucket';
const CFN_VPC = 'AWS::EC2::VPC';
const CFN_NAT_GATEWAY = 'AWS::EC2::NatGateway';
const CFN_EIP = 'AWS::EC2::EIP';

// Terraform Types
const TF_SQS_QUEUE = 'aws_sqs_queue';
const TF_S3_BUCKET = 'aws_s3_bucket';
const TF_VPC = 'aws_vpc';
const TF_NAT_GATEWAY = 'aws_nat_gateway';
const TF_EIP = 'aws_eip';

const resourceTypeMap: Json = {
  [SQS_QUEUE]: SQS_QUEUE,
  [CFN_SQS_QUEUE]: SQS_QUEUE,
  [TF_SQS_QUEUE]: SQS_QUEUE,
  [S3_BUCKET]: S3_BUCKET,
  [CFN_S3_BUCKET]: S3_BUCKET,
  [TF_S3_BUCKET]: S3_BUCKET,
  [VPC]: VPC,
  [CFN_VPC]: VPC,
  [TF_VPC]: VPC,
  [NAT_GATEWAY]: NAT_GATEWAY,
  [CFN_NAT_GATEWAY]: NAT_GATEWAY,
  [TF_NAT_GATEWAY]: NAT_GATEWAY,
  [EIP]: EIP,
  [CFN_EIP]: EIP,
  [TF_EIP]: EIP
};

function getStandardResourceType (type: string): string {
  return resourceTypeMap[type];
}

export {
  SQS_QUEUE,
  S3_BUCKET,
  VPC,
  NAT_GATEWAY,
  EIP,
  getStandardResourceType
};
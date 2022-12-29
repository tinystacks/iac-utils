const TMP_DIRECTORY = '/tmp/iac-utils/tmp';

const CDK_DIFF_CREATE_SYMBOL = '[+]';
const CDK_DIFF_UPDATE_SYMBOL = '[~]';
const CDK_DIFF_DELETE_SYMBOL = '[-]';

const TF_DIFF_CREATE_ACTION = 'create';
const TF_DIFF_UPDATE_ACTION = 'update';
const TF_DIFF_DELETE_ACTION = 'delete';
const TF_DIFF_NO_OP_ACTION = 'no-op';

const AWS_TF_PROVIDER_NAME = 'registry.terraform.io/hashicorp/aws';

const TINYSTACKS_AWS_CDK_PARSER = './tinystacks-aws-cdk-parser';
const TINYSTACKS_TF_PARSER = './tinystacks-tf-parser';

export {
  TMP_DIRECTORY,
  CDK_DIFF_CREATE_SYMBOL,
  CDK_DIFF_UPDATE_SYMBOL,
  CDK_DIFF_DELETE_SYMBOL,
  TF_DIFF_CREATE_ACTION,
  TF_DIFF_UPDATE_ACTION,
  TF_DIFF_DELETE_ACTION,
  TF_DIFF_NO_OP_ACTION,
  AWS_TF_PROVIDER_NAME,
  TINYSTACKS_AWS_CDK_PARSER,
  TINYSTACKS_TF_PARSER
};
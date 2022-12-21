# @tinystacks/iac-utils CLI Documentation

## CLI Options

### iac-utils
Shows usage and help information.

### iac-utils --version
_Alias_: -V
Shows the current installed version number.

### iac-utils --help
_Alias_: -h
Shows usage and help information.

## Available Commands

### iac-utils help
Shows usage and help information.

### iac-utils smoke-test
Performs a smoke-test on an AWS cdk app or a Terraform configuration to validate the planned resources can be launched or updated.  

#### Options
-f, --format <format>  iac format (choices: "tf", "aws-cdk")

-h, --help             display help for this command

#### Authentication
This command requires authentication to the Cloud Provider the CDK app or Terraform config will use.  The following authentication methods are supported.

##### AWS
- Environment Variables (preferred)
- Any other authetication method supported by the [Node Provider Chain](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/modules/_aws_sdk_credential_providers.html#fromnodeproviderchain).

##### GCP
Not supported.

##### Microsoft Azure
Not supported.

#### Smoke Test Behaviour
When the `smoke-test` command is run, it will first perform a diffing operation to determine the changes that deploying the stack would make.  For AWS CDK this is `cdk diff`, for Terraform `terraform plan`.

The diffs from this operation is then used to identify resources that would change.  These resources are then tested first by checking any service quotas in place for their type and then at an individual level to determine if any runtime errors might occur during a deployment.

This command currently checks the following:
1. Any SQS queue names are unique.
1. Any S3 bucket names are unique.
1. The current stack will not surpass the S3 serivce quota.
1. The current stack will not surpass the Elastic IP Address serivce quota.
1. The current stack will not surpass the VPC serivce quota.
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
|Flag|Arguments|Description|
|----|---------|-----------|
|-f, --format|\<format\>|  Specifies the iac format. Can also be set via "format" in the config file. (choices: "tf", "aws-cdk")|
|-rps, --require-private-subnet|  |   For VPC's, requires a subnet with egress to the internet, but no ingress. Can also be set via "requirePrivateSubnet" in in the config file.|
|-c, --config-file|\<config-file\>|  Specifies a config file. Options specified via the command line will always take precedence over options specified in a config file.  Looks for smoke-test.config.json by default.|
|-h, --help||             display help for this command

#### Config File
Alternatively, instead of specifying options via command line flags, you can set them in a configuration file.  This file must be valid JSON and named either smoke-test.config.json or the `--config-file` flag specified.
Valid config properties:
|Property name|Type|Description|
|-------------|----|-----------|
|format|String|Specifies the iac format. (valid values: "tf", "aws-cdk")|
|requirePrivateSubnet|Boolean|For VPC's, requires a subnet with egress to the internet, but no ingress.|
|awsCdkParsers|Array\<String\>|A list of npm module names to parse AWS CDK resources.  By default, the internal TinyStacks AWS CDK Parser will be used.  Any parsers besides defaults must be installed in the target cdk repository.|
|terraformParsers|Array\<String\>|A list of npm module names to parse Terraform resources or modules.  By default, the internal TinyStacks Terraform Resource Parser and TinyStacks Terraform Module Parser will be used. Any parsers besides defaults must be installed in the target terraform repository.|


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
1. (Optional) Verifies that the VPC has private subnets (egress-only subnets via a NAT Gateway or Nat Instance(s)).
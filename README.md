# @tinystacks/iac-utils

## Utility Methods
This package contains stateless utility methods for use in cdk code; particularly useful when developing with the @tinystacks/aws-cdk-constructs node module.

See the [docs](docs/modules.md) for more information.

## CLI
In addition to the utility methods, this package also contains a cli when installed globally.  The cli can be used to smoke test an AWS CDK application or Terraform configuration.

To install run `npm i -g @tinystacks/iac-utils`

The `smoke-test` command will validate the following:
1. Any SQS queue names are unique.
1. Any S3 bucket names are unique.
1. The current stack will not surpass the S3 serivce quota.
1. The current stack will not surpass the Elastic IP Address serivce quota.
1. The current stack will not surpass the VPC serivce quota.

For other information on usage, see `iac-utils --help`;
@tinystacks/iac-utils / [Exports](modules.md)

# @tinystacks/iac-utils

## Utility Methods
This package contains stateless utility methods for use in cdk code; particularly useful when developing with the @tinystacks/aws-cdk-constructs node module.

See the [docs](docs/modules.md) for more information.

## CLI
In addition to the utility methods, this package also contains a cli when installed globally.  The cli can be used to smoke test an AWS CDK application or Terraform configuration.

To install run the cli first install the module globally.
`npm i -g @tinystacks/iac-utils`

Next verify the executable is available.
`which iac-utils`

Finally, run one of the avaiable commands.
`iac-utils smoke-test`

See the cli [docs](docs/cli.md) for more information.

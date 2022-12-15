#!/usr/bin/env node

import { Command, Option } from 'commander';
import * as colors from 'colors';
import { smokeTest } from './commands';
import * as logger from './logger';
import { cleanupTmpDirectory } from './hooks';
import { CustomError } from './errors';
const program = new Command();
// eslint-disable-next-line
const { version } = require('../../package.json');

function handleError (error: Error) {
  if (error.name === CustomError.name) {
    const customError = error as CustomError;
    logger.error(`${customError.message}${customError.reason ? `\n\t${customError.reason}` : ''}`);
    if (customError.hints) {
      customError.hints.forEach(hint => logger.hint(hint));
    }
  } else {
    logger.error('An unexpected error occurred! Please file an issue if one does not exist at https://github.com/tinystacks/iac-utils/issues with the below error.');
    console.error(error);
  }
  process.exit(1);
}

try {
  colors.enable();
  
  program
    .name('iac-utils')
    .description('TinyStacks iac-utils command line interface')
    .version(version);
  
  program.command('smoke-test')
    .description('Performs a smoke-test on an AWS cdk app or a Terraform configuration to validate the planned resources can be launched or updated.')
    .addOption(new Option('-f, --format <format>', 'iac format').choices(['tf', 'aws-cdk']))
    .action(smokeTest)
    .hook('postAction', cleanupTmpDirectory);
  
  program.parseAsync()
    .catch(handleError);
} catch (error) {
  handleError(error as Error);
}
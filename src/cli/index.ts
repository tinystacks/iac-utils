#!/usr/bin/env node

import { Command, Option } from 'commander';
import { smokeTest } from './commands/smoke-test';
const program = new Command();
// eslint-disable-next-line
const { version } = require('../../package.json');

program
  .name('iac-utils')
  .description('TinyStacks iac-utils command line interface')
  .version(version);

program.command('smoke-test')
  .description('Performs a smoke-test on an AWS cdk app or a Terraform configuration to validate the planned resources can be launched or updated.')
  .addOption(new Option('-f, --format <format>', 'iac format').choices(['tf', 'aws-cdk']))
  .action(smokeTest);

program.parse();
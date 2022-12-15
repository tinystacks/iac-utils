import {
  existsSync,
  mkdirSync,
  writeFileSync
} from 'fs';
import { TMP_DIRECTORY } from '../../constants';
import {
  CustomError,
  IacFormat,
  OsOutput,
  ResourceDiffRecord
} from '../../types';
import { runCommand } from '../../utils';
import { parseCdkDiff, parseTerraformDiff } from './parser';

function createTmpDirectory () {
  if (!existsSync(TMP_DIRECTORY)){
    mkdirSync(TMP_DIRECTORY, { recursive: true });
  }
}

function handleNonZeroExitCode (output: OsOutput, process: string) {
  if (output?.exitCode !== 0) {
    throw new CustomError(`${process} failed with exit code ${output?.exitCode}`);
  }
}

async function prepareCdk (): Promise<ResourceDiffRecord[]> {
  const output: OsOutput = await runCommand('cdk diff');
  handleNonZeroExitCode(output, 'cdk diff');
  const diffFileName = `${TMP_DIRECTORY}/diff.txt`;
  writeFileSync(diffFileName, output.stderr);
  return parseCdkDiff(diffFileName);
}

async function prepareTf (): Promise<ResourceDiffRecord[]> {
  const initOutput: OsOutput = await runCommand('terraform init');
  handleNonZeroExitCode(initOutput, 'terraform init');
  const planOutput: OsOutput = await runCommand(`terraform plan -out=${TMP_DIRECTORY}/tfplan`);
  handleNonZeroExitCode(planOutput, 'terraform plan');
  const planFileName = `${TMP_DIRECTORY}/plan.json`;
  const showOutput: OsOutput = await runCommand(`terraform show -no-color -json ${TMP_DIRECTORY}/tfplan > ${planFileName}`);
  handleNonZeroExitCode(showOutput, 'terraform show');
  return parseTerraformDiff(planFileName);
}

async function prepareForSmokeTest (format: IacFormat): Promise<ResourceDiffRecord[]> {
  createTmpDirectory();
  let resourceDiffRecords: ResourceDiffRecord[] = [];
  if (format === IacFormat.awsCdk) {
    resourceDiffRecords = await prepareCdk();
  }
  if (format === IacFormat.tf) {
    resourceDiffRecords =await prepareTf();
  }
  return resourceDiffRecords;
}

export {
  prepareForSmokeTest
};
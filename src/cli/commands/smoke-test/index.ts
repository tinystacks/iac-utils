import { AWS_TF_PROVIDER_NAME } from '../../constants';
import * as logger from '../../logger';
import { IacFormat, ResourceDiffRecord, SmokeTestOptions } from '../../types';
import { detectIacFormat } from './detect-iac-format';
import { prepareForSmokeTest } from './prepare';

async function smokeTestResource (resource: ResourceDiffRecord, format: IacFormat) {
  const isAwsResource = format === IacFormat.awsCdk || (format === IacFormat.tf && resource.resourceRecord.tfProviderName === AWS_TF_PROVIDER_NAME);
  if (isAwsResource) return; // smokeTestAwsResource(resource, format);
}

async function smokeTest (options: SmokeTestOptions) {
  let { format } = options;
  if (!format) {
    format = detectIacFormat();
    logger.info(`No IaC format specified. Using detected format: ${format}`);
  }

  const resourceDiffRecords = await prepareForSmokeTest(format);
  for (const resource of resourceDiffRecords) {
    await smokeTestResource(resource, format);
  }
}

export {
  smokeTest
};
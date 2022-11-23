import * as logger from '../../logger';
import { SmokeTestOptions } from '../../types';
import { detectIacFormat } from './detect-iac-format';
import { prepareForSmokeTest } from './prepare';

async function smokeTest (options: SmokeTestOptions) {
  let { format } = options;
  if (!format) {
    format = detectIacFormat();
    logger.info(`No IaC format specified. Using detected format: ${format}`);
  }

  prepareForSmokeTest(format);
}

export {
  smokeTest
};
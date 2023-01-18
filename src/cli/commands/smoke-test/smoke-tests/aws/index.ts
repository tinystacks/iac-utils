import QuotaChecker from '../../../../abstracts/quota-checker';
import { TINYSTACKS_AWS_QUOTA_CHECKER, TINYSTACKS_AWS_RESOURCE_TESTER } from '../../../../constants';
import { ResourceDiffRecord, SmokeTestOptions } from '../../../../types';
import logger from '../../../../logger';
import ResourceTester from '../../../../abstracts/resource-tester';

const resourceTesterCache: {
  [name: string]: ResourceTester
} = {};

async function tryToUseResourceTester (resource: ResourceDiffRecord, allResources: ResourceDiffRecord[], config: SmokeTestOptions, resourceTesterName: string): Promise<void> {
  let resourceTesterInstance = resourceTesterCache[resourceTesterName];
  try {
    if (!resourceTesterInstance) {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const resourceTester = require(resourceTesterName);
      const mainExport = resourceTester?.default ? resourceTester.default : resourceTester;
      if (mainExport) {
        resourceTesterInstance = new mainExport();
        if (resourceTesterInstance instanceof ResourceTester) {
          resourceTesterCache[resourceTesterName] = resourceTesterInstance;
        } else {
          logger.warn(`Invalid resource tester: ${resourceTesterName}.`);
          logger.warn(`The main export from ${resourceTesterName} does not properly implement ResourceTester.`);
        }
      }
    }
  }
  catch (error) {
    logger.warn(`Invalid resource tester: ${resourceTesterName}.`);
    logger.warn(`The main export from ${resourceTesterName} could not be instantiated.`);
    logger.verbose(error);
  }
  if (resourceTesterInstance) {
    await resourceTesterInstance.testResource(resource, allResources, config);
  }
}

async function testAwsResource (resource: ResourceDiffRecord, allResources: ResourceDiffRecord[], config: SmokeTestOptions) {
  const {
    resourceTesters = []
  } = config;
  if (!resourceTesters.includes(TINYSTACKS_AWS_RESOURCE_TESTER)) resourceTesters.push(TINYSTACKS_AWS_RESOURCE_TESTER);
  for (const resourceTester of resourceTesters) {
    await tryToUseResourceTester(resource, allResources, config, resourceTester);
  }
}

const quotaCheckerCache: {
  [name: string]: QuotaChecker
} = {};

async function tryToUseQuotaChecker (resourceType: string, resources: ResourceDiffRecord[], config: SmokeTestOptions, quotaCheckerName: string): Promise<void> {
  let quotaCheckerInstance = quotaCheckerCache[quotaCheckerName];
  try {
    if (!quotaCheckerInstance) {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const quotaChecker = require(quotaCheckerName);
      const mainExport = quotaChecker?.default ? quotaChecker.default : quotaChecker;
      if (mainExport) {
        quotaCheckerInstance = new mainExport();
        if (quotaCheckerInstance instanceof QuotaChecker) {
          quotaCheckerCache[quotaCheckerName] = quotaCheckerInstance;
        } else {
          logger.warn(`Invalid quota checker: ${quotaCheckerName}.`);
          logger.warn(`The main export from ${quotaCheckerName} does not properly implement QuotaChecker.`);
        }
      }
    }
  }
  catch (error) {
    logger.warn(`Invalid quota checker: ${quotaCheckerName}.`);
    logger.warn(`The main export from ${quotaCheckerName} could not be instantiated.`);
    logger.verbose(error);
  }
  if (quotaCheckerInstance) {
    await quotaCheckerInstance.checkQuota(resourceType, resources, config);
  }
}

async function checkAwsQuotas (resourceType: string, resources: ResourceDiffRecord[], config: SmokeTestOptions) {
  const {
    quotaCheckers = []
  } = config;
  if (!quotaCheckers.includes(TINYSTACKS_AWS_QUOTA_CHECKER)) quotaCheckers.push(TINYSTACKS_AWS_QUOTA_CHECKER);
  for (const quotaChecker of quotaCheckers) {
    await tryToUseQuotaChecker(resourceType, resources, config, quotaChecker);
  }
}

export {
  testAwsResource,
  checkAwsQuotas
};
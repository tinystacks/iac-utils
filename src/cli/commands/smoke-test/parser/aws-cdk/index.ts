import { readFileSync } from 'fs';
import { resolve as resolvePath } from 'path';
import {
  CDK_DIFF_CREATE_SYMBOL,
  CDK_DIFF_DELETE_SYMBOL,
  CDK_DIFF_UPDATE_SYMBOL,
  TINYSTACKS_AWS_CDK_PARSER
} from '../../../../constants';
import {
  CdkDiff,
  ChangeType,
  IacFormat,
  Json,
  ResourceDiffRecord,
  DiffSection,
  SmokeTestOptions
} from '../../../../types';
import { AwsCdkParser } from '../../../../abstracts';
import * as logger from '../../../../logger';

function partitionDiff (diff: string[], diffHeaders: string[]): DiffSection[] {
  const headerIndices: { [key: string]: number } = diffHeaders.reduce<{ [key: string]: number }>((acc, header) => {
    const headerIndex = diff.findIndex(line => line.trim() === header);
    acc[header] = headerIndex;
    return acc;
  }, {});

  const allHeaderIndices: number[] = Object.values(headerIndices).sort();
  return Object.entries(headerIndices).reduce<DiffSection[]>((acc, [ header, headerIndex ]) => {
    const sectionName = header.trim().replace('Stack ', '');
    const nextStackHeaderIndex = allHeaderIndices[allHeaderIndices.indexOf(headerIndex) + 1];
    
    const stackDiffLines: string[] = diff.slice(headerIndex + 1, nextStackHeaderIndex);

    acc.push({
      sectionName,
      diffLines: stackDiffLines
    });
    return acc;
  }, []);
}

function separateStacks (diff: string[]): DiffSection[] {
  const stackHeaders = diff.filter(line => line.trim().startsWith('Stack '));
  return partitionDiff(diff, stackHeaders);
}

function getChangeTypeForCdkDiff (changeTypeSymbol: string): ChangeType {
  switch (changeTypeSymbol) {
    case CDK_DIFF_CREATE_SYMBOL:
      return ChangeType.CREATE;
    case CDK_DIFF_UPDATE_SYMBOL:
      return ChangeType.UPDATE;
    case CDK_DIFF_DELETE_SYMBOL:
      return ChangeType.DELETE;
    default:
      return ChangeType.UNKNOWN;
  }
}

function parseDiffLine (diff: string): CdkDiff {
  const [ changeTypeSymbol, resourceType, cdkPath, logicalId ] = diff.trim().replace(/\t/g, '').split(' ').filter(elem => elem.trim().length !== 0);
  return {
    changeTypeSymbol,
    resourceType: resourceType?.indexOf('::') > 0 ? resourceType : undefined,
    cdkPath,
    logicalId
  };
}

const parsers: {
  [parserName: string]: AwsCdkParser
} = {};

async function tryToUseParser (diff: CdkDiff, cloudformationTemplate: Json, parserName: string): Promise<Json | undefined> {
  try {
    let parserInstance = parsers[parserName];
    if (!parserInstance) {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const parser = require(parserName);
      if (parser) {
        parserInstance = new parser.default();
        if (parserInstance instanceof AwsCdkParser) {
          parsers[parserName] = parserInstance;
        } else {
          logger.warn(`Invalid parser: ${parserName}.`);
          logger.warn(`The main export from ${parserName} does not properly implement TerraformParser.`);
        }
      }
    }
    if (parserInstance) {
      return await parserInstance.parseResource(diff, cloudformationTemplate);
    }
    return undefined;
  }
  catch (error) {
    logger.warn(`Invalid parser: ${parserName}.`);
    logger.warn(`The main export from ${parserName} could not be instantiated or it threw an error while parsing the resource.`);
    logger.verbose(error);
    return undefined;
  }
}

async function parseCdkResource (diff: CdkDiff, cloudformationTemplate: Json, config: SmokeTestOptions): Promise<Json> {
  const {
    awsCdkParsers = []
  } = config;
  if (!awsCdkParsers.includes(TINYSTACKS_AWS_CDK_PARSER)) awsCdkParsers.push(TINYSTACKS_AWS_CDK_PARSER);
  let properties = {};
  for (const parser of awsCdkParsers) {
    const response = await tryToUseParser(diff, cloudformationTemplate, parser);
    if (response) {
      properties = response;
      break;
    }
  }
  return properties;
}

async function composeCdkResourceDiffRecords (stackName: string, diffs: string[] = [], config: SmokeTestOptions = {}): Promise<ResourceDiffRecord[]> {
  const templateJson: Json = JSON.parse(readFileSync(resolvePath(`./cdk.out/${stackName}.template.json`)).toString() || '{}');
  const resources: ResourceDiffRecord[] = [];
  for (const diff of diffs) {
    const cdkDiff: CdkDiff = parseDiffLine(diff);
    const {
      changeTypeSymbol,
      resourceType,
      cdkPath,
      logicalId
    } = cdkDiff;
    const changeType = getChangeTypeForCdkDiff(changeTypeSymbol);
    if (changeType === ChangeType.UNKNOWN || !resourceType || !cdkPath || !logicalId) continue;
    const [ _logicalId, cfnEntry = {} ] = Object.entries<Json>(templateJson.Resources).find(([key]) => key === logicalId) || [];
    const resourceDiffRecord: ResourceDiffRecord = {
      stackName,
      format: IacFormat.awsCdk,
      changeType,
      resourceType: cfnEntry.Type || resourceType,
      address: cdkPath,
      logicalId,
      properties: await parseCdkResource(cdkDiff, templateJson, config)
    };
    resources.push(resourceDiffRecord);
  }
  return resources;
}

async function parseStackDiff (stackDiffLines: DiffSection, config: SmokeTestOptions): Promise<ResourceDiffRecord[]> {
  const {
    sectionName: stackName,
    diffLines
  } = stackDiffLines;
  const diffHeaders = ['IAM Statement Changes', 'IAM Policy Changes', 'Parameters', 'Resources', 'Outputs', 'Other Changes'];

  const diffSections = partitionDiff(diffLines, diffHeaders);
  const resourceDiffs = diffSections.find(diffSection => diffSection.sectionName === 'Resources');
  return composeCdkResourceDiffRecords(stackName, resourceDiffs?.diffLines, config);
}

async function parseCdkDiff (diffTxt: string, config: SmokeTestOptions): Promise<ResourceDiffRecord[]> {
  const diff = diffTxt.split('\n').filter(line => line.trim().length !== 0);
  const stackDiffLines = separateStacks(diff);
  const diffRecords: ResourceDiffRecord[] = [];
  for (const stackDiff of stackDiffLines) {
    const stackResources = await parseStackDiff(stackDiff, config);
    diffRecords.push(...stackResources);
  }
  return diffRecords;
}

export {
  parseCdkDiff
};
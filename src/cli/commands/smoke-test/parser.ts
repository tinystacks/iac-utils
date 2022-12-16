import { readFileSync } from 'fs';
import { resolve as resolvePath } from 'path';
import {
  CDK_DIFF_CREATE_SYMBOL,
  CDK_DIFF_DELETE_SYMBOL,
  CDK_DIFF_UPDATE_SYMBOL,
  TF_DIFF_CREATE_ACTION,
  TF_DIFF_DELETE_ACTION,
  TF_DIFF_NO_OP_ACTION,
  TF_DIFF_UPDATE_ACTION
} from '../../constants';
import {
  CdkDiff,
  ChangeType,
  IacFormat,
  Json,
  ResourceDiffRecord,
  DiffSection,
  ResourceRecord
} from '../../types';

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

function composeCdkResourceDiffRecords (stackName: string, diffs: string[] = [] ): ResourceDiffRecord[] {
  const templateJson: Json = JSON.parse(readFileSync(resolvePath(`./cdk.out/${stackName}.template.json`)).toString() || '{}');
  return diffs.reduce<ResourceDiffRecord[]>((acc: ResourceDiffRecord[], diff: string): ResourceDiffRecord[] => {
    const {
      changeTypeSymbol,
      resourceType,
      cdkPath,
      logicalId
    }: CdkDiff = parseDiffLine(diff);
    const changeType = getChangeTypeForCdkDiff(changeTypeSymbol);
    if (changeType === ChangeType.UNKNOWN || !resourceType || !cdkPath || !logicalId) return acc;
    const [ _logicalId, cfnEntry = {} ] = Object.entries<Json>(templateJson.Resources).find(([key]) => key === logicalId) || [];
    const resourceRecord: ResourceRecord = {
      address: cdkPath,
      type: cfnEntry.Type || resourceType,
      properties: cfnEntry.Properties || {}
    };
    const resourceDiffRecord: ResourceDiffRecord = {
      stackName,
      format: IacFormat.awsCdk,
      changeType,
      resourceType: resourceRecord.type,
      resourceRecord
    };
    acc.push(resourceDiffRecord);
    return acc;
  }, []);
}

function parseStackDiff (stackDiffLines: DiffSection): ResourceDiffRecord[] {
  const {
    sectionName: stackName,
    diffLines
  } = stackDiffLines;
  const diffHeaders = ['IAM Statement Changes', 'IAM Policy Changes', 'Parameters', 'Resources', 'Outputs', 'Other Changes'];

  const diffSections = partitionDiff(diffLines, diffHeaders);
  const resourceDiffs = diffSections.find(diffSection => diffSection.sectionName === 'Resources');
  return composeCdkResourceDiffRecords(stackName, resourceDiffs?.diffLines);
}

function parseCdkDiff (diffFile: string): ResourceDiffRecord[] {
  const diffTxt = readFileSync(diffFile).toString() || '';
  const diff = diffTxt.split('\n').filter(line => line.trim().length !== 0);
  const stackDiffLines = separateStacks(diff);
  return stackDiffLines.reduce<ResourceDiffRecord[]>((acc, stackDiff) => {
    acc.push(...parseStackDiff(stackDiff));
    return acc;
  }, []);
}

function getChangeTypeForTerraformDiff (tfChangeType: string): ChangeType {
  switch (tfChangeType) {
    case TF_DIFF_CREATE_ACTION:
      return ChangeType.CREATE;
    case TF_DIFF_UPDATE_ACTION:
      return ChangeType.UPDATE;
    case TF_DIFF_DELETE_ACTION:
      return ChangeType.DELETE;
    case TF_DIFF_NO_OP_ACTION:
      return ChangeType.NO_CHANGES;
    default:
      return ChangeType.UNKNOWN;
  }
}

function parseTerraformDiff (planFile: string): ResourceDiffRecord[] {
  const planJson: Json = JSON.parse(readFileSync(planFile)?.toString() || '{}');
  const {
    resource_changes = [] as Json[]
  } = planJson;
  return resource_changes.reduce((acc: ResourceDiffRecord[], resourceChange: Json): ResourceDiffRecord[] => {
    const {
      address,
      change: {
        before = {},
        after = {},
        actions: [
          beforeAction,
          afterAction
        ] = []
      } = {},
      type,
      provider_name: tfProviderName
    } = resourceChange || {};

    if (afterAction) {
      acc.push({
        format: IacFormat.tf,
        resourceType: type,
        changeType: getChangeTypeForTerraformDiff(beforeAction),
        resourceRecord: {
          address,
          type,
          tfProviderName,
          properties: before
        }
      });
    }
    const changeType = getChangeTypeForTerraformDiff(afterAction || beforeAction);
    if (changeType !== ChangeType.NO_CHANGES) {
      acc.push({
        format: IacFormat.tf,
        resourceType: type,
        changeType,
        resourceRecord: {
          address,
          type,
          tfProviderName,
          properties: after
        }
      });
    }
    return acc;
  }, []);
}

export {
  parseCdkDiff,
  parseTerraformDiff
};
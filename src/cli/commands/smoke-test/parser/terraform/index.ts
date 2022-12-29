import { readFileSync } from 'fs';
import {
  TF_DIFF_CREATE_ACTION,
  TF_DIFF_DELETE_ACTION,
  TF_DIFF_NO_OP_ACTION,
  TF_DIFF_UPDATE_ACTION,
  TINYSTACKS_TF_PARSER
} from '../../../../constants';
import {
  ChangeType,
  IacFormat,
  Json,
  ResourceDiffRecord,
  SmokeTestOptions,
  TfDiff
} from '../../../../types';
import * as logger from '../../../../logger';

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

async function tryToUseParser (diff: TfDiff, tfPlan: Json, parserName: string): Promise<Json | undefined> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const {
      parseResource
    } = require(parserName) || {};
    if (parseResource) return await parseResource(diff, tfPlan);
    return undefined;
  }
  catch (error) {
    return undefined;
  }
}

async function parseTfResource (diff: TfDiff, tfPlan: Json, config: SmokeTestOptions): Promise<Json> {
  const {
    awsCdkParsers = []
  } = config;
  if (!awsCdkParsers.includes(TINYSTACKS_TF_PARSER)) awsCdkParsers.push(TINYSTACKS_TF_PARSER);
  let properties;
  for (const parser of awsCdkParsers) {
    const response = await tryToUseParser(diff, tfPlan, parser);
    if (response) {
      properties = response;
      break;
    }
  }
  const { address, logicalId, resourceType } = diff;
  if (!properties) logger.warn(`None of the configured parsers could parse resource ${address || `${resourceType}.${logicalId}`}`);
  return properties;
}

async function parseTerraformDiff (planFile: string, config: SmokeTestOptions): Promise<ResourceDiffRecord[]> {
  const planJson: Json = JSON.parse(readFileSync(planFile)?.toString() || '{}');
  const {
    resource_changes = [] as Json[]
    // configuration = {} as Json
  } = planJson;
  
  // const {
  //   resources = [],
  //   module_calls = {} as Json
  // } = configuration.root_module || {};

  // const moduleResources: Json[] = Object.entries(module_calls).reduce((acc: Json[], [moduleName, moduleCall]: [string, Json]) => {
  //   const scopedModuleResources = moduleCall.module?.resources?.map((moduleResource: Json) => {
  //     moduleResource.address = moduleResource.address.startsWith('module') ? moduleResource.address : `module.${moduleName}.${moduleResource.address}`;
  //     moduleResource.expressions = Object.fromEntries(Object.entries(moduleResource.expressions || {}).map(([key, value]: [string, Json]) => {
  //       const references: string[] = value.references?.map((reference: string) => reference.startsWith('module') ? reference : `module.${moduleName}.${reference}`) || [];
  //       return [key, { references }];
  //     }));
  //     moduleResource.for_each_expression = { references: moduleResource.for_each_expression?.references.map((reference: string) => reference.startsWith('module') ? reference : `module.${moduleName}.${reference}`) || [] };
  //     return moduleResource;
  //   });
  //   acc.push(...scopedModuleResources);
  //   return acc;
  // }, []);

  // const allResources: Json[] = [...resources, ...moduleResources];

  // const crossResourceReferences: { [address: string]: TfReference[] } = allResources.reduce((crossResourceReferencesAccumulator: { [address: string]: TfReference[] }, resource: Json) => {
  //   const {
  //     address,
  //     expressions = {} as Json,
  //     for_each_expression = {} as Json
  //   } = resource || {};
  //   const resourceReferences: TfReference[] = Object.entries(expressions).reduce((acc: TfReference[], [property, metaData]: [string, Json]) => {
  //     const {
  //       references = []
  //     } = metaData || {};
  //     acc.push(...references.map((reference: string) => {
  //       return {
  //         property,
  //         reference
  //       };
  //     }));
  //     return acc;
  //   }, []);

  //   for_each_expression.references?.forEach((reference: string) => {
  //     resourceReferences.push({
  //       property: 'for_each',
  //       reference
  //     });
  //   });

  //   crossResourceReferencesAccumulator[address] = crossResourceReferencesAccumulator[address] || [];
  //   crossResourceReferencesAccumulator[address].push(...resourceReferences);
  //   return crossResourceReferencesAccumulator;
  // }, {});
  const resources: ResourceDiffRecord[] = [];
  for (const resourceChange of resource_changes) {
    const {
      address,
      index,
      name: logicalId,
      change: {
        // before = {},
        // after = {},
        actions: [
          beforeAction,
          afterAction
        ] = []
      } = {},
      type,
      provider_name: providerName
    } = resourceChange || {};

    if (afterAction) {
      const beforeDiff: TfDiff = {
        address,
        logicalId,
        action: beforeAction,
        index,
        resourceType: type
      };
      resources.push({
        format: IacFormat.tf,
        resourceType: type,
        changeType: getChangeTypeForTerraformDiff(beforeAction),
        address,
        index,
        logicalId,
        providerName,
        properties: await parseTfResource(beforeDiff, planJson, config)
      });
    }
    const changeType = getChangeTypeForTerraformDiff(afterAction || beforeAction);
    if (changeType !== ChangeType.NO_CHANGES) {
      const afterDiff: TfDiff = {
        address,
        logicalId,
        action: afterAction,
        index,
        resourceType: type
      };
      resources.push({
        format: IacFormat.tf,
        resourceType: type,
        changeType,
        address,
        index,
        logicalId,
        providerName,
        properties: await parseTfResource(afterDiff, planJson, config)
      });
    }
  }
  return resources;
}

export {
  parseTerraformDiff
};
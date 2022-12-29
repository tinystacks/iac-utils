/*
import { readFileSync } from 'fs';
import {
  TF_DIFF_CREATE_ACTION,
  TF_DIFF_DELETE_ACTION,
  TF_DIFF_NO_OP_ACTION,
  TF_DIFF_UPDATE_ACTION
} from '../../../../constants';
import {
  ChangeType,
  IacFormat,
  Json,
  ResourceDiffRecord
} from '../../../../types';
import isEmpty from 'lodash.isempty';

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
    resource_changes = [] as Json[],
    configuration = {} as Json
  } = planJson;
  
  const {
    resources = [],
    module_calls = {} as Json
  } = configuration.root_module || {};

  const moduleResources: Json[] = Object.entries(module_calls).reduce((acc: Json[], [moduleName, moduleCall]: [string, Json]) => {
    const scopedModuleResources = moduleCall.module?.resources?.map((moduleResource: Json) => {
      moduleResource.address = moduleResource.address.startsWith('module') ? moduleResource.address : `module.${moduleName}.${moduleResource.address}`;
      moduleResource.expressions = Object.fromEntries(Object.entries(moduleResource.expressions || {}).map(([key, value]: [string, Json]) => {
        const references: string[] = value.references?.map((reference: string) => reference.startsWith('module') ? reference : `module.${moduleName}.${reference}`) || [];
        return [key, { references }];
      }));
      moduleResource.for_each_expression = { references: moduleResource.for_each_expression?.references.map((reference: string) => reference.startsWith('module') ? reference : `module.${moduleName}.${reference}`) || [] };
      return moduleResource;
    });
    acc.push(...scopedModuleResources);
    return acc;
  }, []);

  const allResources: Json[] = [...resources, ...moduleResources];

  const crossResourceReferences: { [address: string]: TfReference[] } = allResources.reduce((crossResourceReferencesAccumulator: { [address: string]: TfReference[] }, resource: Json) => {
    const {
      address,
      expressions = {} as Json,
      for_each_expression = {} as Json
    } = resource || {};
    const resourceReferences: TfReference[] = Object.entries(expressions).reduce((acc: TfReference[], [property, metaData]: [string, Json]) => {
      const {
        references = []
      } = metaData || {};
      acc.push(...references.map((reference: string) => {
        return {
          property,
          reference
        };
      }));
      return acc;
    }, []);

    for_each_expression.references?.forEach((reference: string) => {
      resourceReferences.push({
        property: 'for_each',
        reference
      });
    });

    crossResourceReferencesAccumulator[address] = crossResourceReferencesAccumulator[address] || [];
    crossResourceReferencesAccumulator[address].push(...resourceReferences);
    return crossResourceReferencesAccumulator;
  }, {});

  return resource_changes.reduce((acc: ResourceDiffRecord[], resourceChange: Json): ResourceDiffRecord[] => {
    const {
      address,
      index,
      name: logicalId,
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
          index,
          type,
          logicalId,
          tfProviderName,
          properties: before
        }
      });
    }
    const changeType = getChangeTypeForTerraformDiff(afterAction || beforeAction);
    if (changeType !== ChangeType.NO_CHANGES) {
      const nonIndexedAddress = !isEmpty(index) ? address.replace(`["${index}"]`, ''): address;
      acc.push({
        format: IacFormat.tf,
        resourceType: type,
        changeType,
        resourceRecord: {
          address,
          index,
          type,
          logicalId,
          tfProviderName,
          tfReferences: crossResourceReferences[nonIndexedAddress],
          properties: after
        }
      });
    }
    return acc;
  }, []);
}

export {
  parseTerraformDiff
};
*/
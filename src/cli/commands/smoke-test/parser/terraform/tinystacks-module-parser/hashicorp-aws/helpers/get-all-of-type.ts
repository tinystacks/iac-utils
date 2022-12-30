import { Json, TfDiff } from '../../../../../../../types';
import { getResource } from './get-resource';

function getAllOfType (tfPlan: Json, type: string, moduleAddress: string): Json[] {
  const homeModule = tfPlan?.planned_values?.root_module?.child_modules?.find((mod: Json) => mod.address === moduleAddress);
  const resourcesForType = homeModule?.resources?.filter((resource: Json) => resource.type === type) || [];
  return resourcesForType.map((resource: Json) => {
    const stubbedDiff: TfDiff = {
      address: resource.address,
      resourceType: resource.type,
      logicalId: resource.name
    };
    return getResource(stubbedDiff, tfPlan);
  });
}

export {
  getAllOfType
};
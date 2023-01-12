import { NameValidationResponse, resourceNameRules, validateName } from '.';

/**
 * @hidden
 * */
function validateStackName (stackName: string): NameValidationResponse {
  return validateName(stackName, resourceNameRules.TinyStacks.iacStackName, 'Stack name');
}

export {
  validateStackName
};
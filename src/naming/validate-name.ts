import { NameRestriction } from '.';

interface NameValidationResponse {
  isValid: boolean;
  reason?: string;
}

class NameValidationResponse implements NameValidationResponse {
  constructor (isValid: boolean, reason?: string) {
    this.isValid = isValid;
    this.reason = reason;
  }
}

/**
 * Validates a name against a NameRestriction.
 * Returns a response with a boolean property indicating validity and a string property with a human readable reason for invalidity.
 */
function validateName (name = '', nameRestriction: NameRestriction = {}, label = 'Name'): NameValidationResponse {
  const {
    minimumLength,
    characterLimit,
    characterRestrictions,
    allowedCharacterTypes
  } = nameRestriction;

  if (minimumLength && name.length < minimumLength) {
    return new NameValidationResponse(false, `${label} must be at least ${minimumLength} characters!`);
  }
  
  if (characterLimit && name.length > characterLimit) {
    return new NameValidationResponse(false, `${label} must be less than ${characterLimit} characters!`);
  }

  if (characterRestrictions && characterRestrictions.test(name)) {
    return new NameValidationResponse(false, `${label} can only contain ${allowedCharacterTypes}!`);
  }

  return new NameValidationResponse(true);
}

export {
  NameValidationResponse,
  validateName
};
import { alphaNumericAndHyphen, alphaNumericAndHyphenAllowedCharacterTypes, NameRestriction, validateName } from "../../src";

describe('validateName', () => {
  it('returns invalid if name does not meet minimum length', () => {
    const name = 'abc';
    const restriction: NameRestriction = {
      minimumLength: 5
    };

    const response = validateName(name, restriction);
    expect(response.isValid).toBe(false);
    expect(response.reason).toEqual('Name must be at least 5 characters!');
  });
  it('returns invalid if name does not meet character limit requirement', () => {
    const name = 'abcdef';
    const restriction: NameRestriction = {
      characterLimit: 5
    };

    const response = validateName(name, restriction);
    expect(response.isValid).toBe(false);
    expect(response.reason).toEqual('Name must be less than 5 characters!');
  });
  it('returns invalid if name contains disallowed characters', () => {
    const name = 'ab-cd@ef';
    const restriction: NameRestriction = {
      characterRestrictions: alphaNumericAndHyphen,
      allowedCharacterTypes: alphaNumericAndHyphenAllowedCharacterTypes
    };

    const response = validateName(name, restriction);
    expect(response.isValid).toBe(false);
    expect(response.reason).toEqual('Name can only contain alphanumeric characters and hyphens!');
  });
  it('returns valid if name meets all requirements', () => {
    const name = 'abc-def';
    const restriction: NameRestriction = {
      minimumLength: 3,
      characterLimit: 10,
      characterRestrictions: alphaNumericAndHyphen,
      allowedCharacterTypes: alphaNumericAndHyphenAllowedCharacterTypes
    };

    const response = validateName(name, restriction);
    expect(response.isValid).toBe(true);
    expect(response.reason).toBeUndefined();
  });
  it('returns valid if no arguments are passed', () => {
    const response = validateName();
    expect(response.isValid).toBe(true);
    expect(response.reason).toBeUndefined();
  });
});
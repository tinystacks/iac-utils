import { validateStackName } from "../../src";

describe('validateStackName', () => {
  it('returns invalid if name does not meet minimum length', () => {
    const response1 = validateStackName('');
    expect(response1.isValid).toBe(false);
    expect(response1.reason).toEqual('Stack name must be at least 2 characters!');
    const response2 = validateStackName('a');
    expect(response2.isValid).toBe(false);
    expect(response2.reason).toEqual('Stack name must be at least 2 characters!');
  });
  it('returns invalid if name does not meet character limit requirement', () => {
    const name = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';

    const response = validateStackName(name);
    expect(response.isValid).toBe(false);
    expect(response.reason).toEqual('Stack name must be less than 64 characters!');
  });
  it('returns invalid if name contains disallowed characters', () => {
    const name = 'test_stack';

    const response = validateStackName(name);
    expect(response.isValid).toBe(false);
    expect(response.reason).toEqual('Stack name can only contain alphanumeric characters and hyphens!');
  });
  it('returns valid if name meets all requirements', () => {
    const name = 'test-stack';

    const response = validateStackName(name);
    expect(response.isValid).toBe(true);
    expect(response.reason).toBeUndefined();
  });
});
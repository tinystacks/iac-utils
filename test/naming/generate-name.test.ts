import { alphaNumericAndHyphen, generateName } from '../../src';

describe('name-utils', () => {
  describe('generateName', () => {
    it('concatenates unique, non-empty identifiers with the specified separator', () => {
      const identifiers = ['abc', '123', 'abc', ''];
      const name = generateName({
        identifiers,
        separator: '&'
      });
      expect(name).toEqual('abc&123');
    });
    it('replaces disallowed characters if restrictions are passed', () => {
      const identifiers = ['a@b.c', '1#2$3'];
      const name = generateName({
        identifiers,
        nameRestriction: {
          characterRestrictions: alphaNumericAndHyphen
        }
      });
      expect(name).toEqual('abc-123');
    });
  });
});
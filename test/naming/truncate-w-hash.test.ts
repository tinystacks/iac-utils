import { truncateWithSemiHash } from '../../src';

describe('name-utils', () => {
  describe('truncateWithSemiHash', () => {
    it('truncates name and appends last 8 characters of md5 hash', () => {
      const name = '12345678901';
      const result = truncateWithSemiHash(name, 10);
      expect(result).toEqual('1221365973');
    });
    it('returns name if it is less than the max length', () => {
      const name = '123456789';
      const result = truncateWithSemiHash(name, 10);
      expect(result).toEqual('123456789');
    });
    it('returns name if it is equal to the max length', () => {
      const name = '1234567890';
      const result = truncateWithSemiHash(name, 10);
      expect(result).toEqual('1234567890');
    });
  });
});
import { allocateSubnetMask } from '../../src';

describe('Allocate Subnet Mask', () => {
  describe('common cidrMask and subnet configurations', () => {
    it('cidrMask 16, 4 subnets', () => {
      const subnetMask = allocateSubnetMask(16, 4);
      expect(subnetMask).toEqual(18);
    });
    it('cidrMask 16, 6 subnets', () => {
      const subnetMask = allocateSubnetMask(16, 6);
      expect(subnetMask).toEqual(19);
    });
    it('cidrMask 24, 4 subnets', () => {
      const subnetMask = allocateSubnetMask(24, 4);
      expect(subnetMask).toEqual(26);
    });
    it('cidrMask 24, 6 subnets', () => {
      const subnetMask = allocateSubnetMask(24, 6);
      expect(subnetMask).toEqual(27);
    });
  })
  describe('default cidrMask of 16 with subnet count based on 3 subnet types per availability zone', () => {
    it('us-east-1: 6 availability zones => 18 subnets', () => {
      const subnetMask = allocateSubnetMask(16, 18);
      expect(subnetMask).toEqual(21);
    });
    it('us-east-2: 3 availability zones => 9 subnets', () => {
      const subnetMask = allocateSubnetMask(16, 9);
      expect(subnetMask).toEqual(20);
    });
    it('us-west-1: 2 availability zones => 6 subnets', () => {
      const subnetMask = allocateSubnetMask(16, 6);
      expect(subnetMask).toEqual(19);
    });
    it('eu-west-1: 3 availability zones => 9 subnets', () => {
      const subnetMask = allocateSubnetMask(16, 9);
      expect(subnetMask).toEqual(20);
    });
  });
});
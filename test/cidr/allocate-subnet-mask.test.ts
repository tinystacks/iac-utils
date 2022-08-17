import { allocateSubnetMask } from '../../src';

describe('Allocate Subnet Mask', () => {
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
});
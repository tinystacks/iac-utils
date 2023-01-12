/**
 * Given the subnet mask of a cidr range and the number of desired subnets, this function will calculate the largest possible mask for the count of subnets to fit within the cidr range.
 * @example
 * ```ts
 * allocateSubnetMask(16, 4) // => 18
 * allocateSubnetMask(24, 4) // => 26
 * allocateSubnetMask(16, 18) // => 21
 * ```
 * @param cidrMask - number
 * @param subnetCount - number
 * @returns number
 */
function allocateSubnetMask (cidrMask: number, subnetCount: number): number {
  const addressCount = Math.pow(2, (32 - cidrMask));
  
  const addressesPerSubnet = Math.floor(addressCount / subnetCount);
  
  const subnetMask = Math.abs(Math.floor(Math.log2(addressesPerSubnet)) - 32);

  return subnetMask;
}

export {
  allocateSubnetMask
};
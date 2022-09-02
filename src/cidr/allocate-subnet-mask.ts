function allocateSubnetMask (cidrMask: number, subnetCount: number) {
  const addressCount = Math.pow(2, (32 - cidrMask));
  
  const addressesPerSubnet = Math.floor(addressCount / subnetCount);
  
  const subnetMask = Math.abs(Math.floor(Math.log2(addressesPerSubnet)) - 32);

  return subnetMask;
}

export {
  allocateSubnetMask
};
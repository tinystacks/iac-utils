import Prando from 'prando';

/**
 * Return value for allocateCidrBlock.
 */
interface CidrBlockAllocation {
  /**
   * The CIDR range that was generated.
   * @example
   * 10.0.0.0/16
   */
  cidrBlock: string;
  /**
   * The seed used to generate this CIDR block.
   */
  seed: string;
  /**
   * The IP prefix of the CIDR range (IPv4 address of the start of the range).
   * @example
   * 10.0.0.0
   */
  prefix: string;
  /**
   * The network mask of the CIDR range (integer representing the range of the CIDR block).
   * @example
   * 16
   */
  networkMask: number;
}

/**
 * Arguments for generating a CIDR block.
 */
interface AllocateCidrBlockArguments {
  /**
   * A string to be used as a seed for the CIDR generation.
   * 
   * @remarks
   * If all other inputs are the same, two different seeds have a 1 in 256 chance of being duplicates.
   * If you are generating multiple CIDR blocks and need them to be unique, generate them in sequence providing previously generated blocks in the {@link exclusions} argument.
   */
  seed: string;
  /**
   * An IPv4 prefix for the CIDR block to use as a base.
   * 
   * @remarks
   * Depending on the network mask, one of the octets will likely be replaced.
   * This should typically be from the Private Address Space defined in RFC 1918 {@link http://www.faqs.org/rfcs/rfc1918.html}
   * 
   * @defaultValue 10.0.0.0
   */
  prefix?: string;
  /**
   * An integer between 8 and 32
   * 
   * @remarks
   * This value will determine how many IP addresses are available within your CIDR block.
   * 
   * @defaultValue 16
   */
  networkMask?: number;
  /**
   * CIDR blocks that should be excluded from the results.
   * 
   * @remarks
   * If the CIDR block generated matches any of the values provided here, the method will re-generate and re-check against this list until it runs out of options.
   * Note that for a given prefix and network mask, only 256 unique CIDR blocks can be generated.
   */
  exclusions?: string[];
}

interface ValidatedAllocateCidrBlockArguments {
  seed: string;
  prefix: string;
  networkMask: number;
  exclusions: string[];
}

function constructCidr (intHash: number, args: ValidatedAllocateCidrBlockArguments): CidrBlockAllocation {
  const {
    prefix: inputPrefix,
    networkMask,
    seed
  } = args;

  const addressCount = Math.pow(2, (32 - networkMask));
  let intHashPosition = 1;
  if (addressCount <= 256) {
    intHashPosition = 3;
  } else if (addressCount > 256 && addressCount < 65536) {
    intHashPosition = 2;
  }

  const prefixElems = inputPrefix.split('.');
  prefixElems[intHashPosition] = intHash.toString();
  const prefix = prefixElems.join('.');
  const cidrBlock = [prefix, networkMask].join('/');
  return {
    cidrBlock,
    networkMask,
    prefix,
    seed
  };
}

function isIPv4 (ip: string): boolean {
  const octets = ip.split('.');
  const hasFourOctets = octets.length === 4;
  const eachOctetIs8Bit = octets.reduce<boolean>((acc, octet: string) => {
    const numOctet = Number(octet);
    const octetIs8Bit = !Number.isNaN(numOctet) && numOctet >= 0 && numOctet <= 255;
    acc = acc && octetIs8Bit;
    return acc;
  }, true);
  return hasFourOctets && eachOctetIs8Bit;
}

function isValidNetworkMask (networkMask: number): boolean {
  return networkMask >= 8 && networkMask <= 32;
}

function validateArguments (args: AllocateCidrBlockArguments): ValidatedAllocateCidrBlockArguments {
  const {
    seed,
    prefix = '10.0.0.0',
    networkMask = 16,
    exclusions = []
  } = args;
  if (!seed || typeof seed !== 'string' || seed?.length < 1) {
    throw new Error(`Invalid value: ${seed}; "seed" argument must be a string with length greater than zero!`);
  }
  if (!isIPv4(prefix)) {
    throw new Error(`Invalid value: ${prefix}; "prefix" argument must be a valid IPv4 address!`);
  }
  if (!isValidNetworkMask(networkMask)) {
    throw new Error(`Invalid value: ${networkMask}; "networkMask" argument must be an integer between 8 and 32!`);
  }
  for (const exclusion of exclusions) {
    const [exclusionPrefix, exclusionNetworkMask] = exclusion.split('/');
    if (!isIPv4(exclusionPrefix) || !isValidNetworkMask(Number(exclusionNetworkMask))) {
      throw new Error(`Invalid exclusion value: ${exclusion}; an exclusion must be a valid IPv4 CIDR Block!`);
    }
  }

  return {
    seed,
    prefix,
    networkMask,
    exclusions
  };
}

function generateCidrBlock (rng: Prando, args: ValidatedAllocateCidrBlockArguments): CidrBlockAllocation {
  const {
    exclusions
  } = args;
  const intHash = rng.nextInt(0, 255);
  const cidrBlockAllocation = constructCidr(intHash, args);
  if (exclusions?.includes(cidrBlockAllocation.cidrBlock)) return generateCidrBlock(rng, args);
  return cidrBlockAllocation;
}

/**
 * Deterministically generate a CIDR block range.
 * 
 * @remarks
 * Given the same inputs, it will generate the same output.
 * This can be useful if you need to create mutiple VPCs that need to be peered since peered VPCs cannot have overlapping CIDR ranges.
 * 
 * @param args - {@link AllocateCidrBlockArguments}
 * @returns CidrBlockAllocation - {@link CidrBlockAllocation}
 */
function allocateCidrBlock (args: AllocateCidrBlockArguments): CidrBlockAllocation {
  const validatedArguments = validateArguments(args);
  const rng = new Prando(validatedArguments.seed);
  return generateCidrBlock(rng, validatedArguments);
}

export {
  allocateCidrBlock,
  CidrBlockAllocation,
  AllocateCidrBlockArguments
};
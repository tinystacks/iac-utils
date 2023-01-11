[@tinystacks/iac-utils](../README.md) / [Exports](../modules.md) / AllocateCidrBlockArguments

# Interface: AllocateCidrBlockArguments

Arguments for generating a CIDR block.

## Table of contents

### Properties

- [exclusions](AllocateCidrBlockArguments.md#exclusions)
- [networkMask](AllocateCidrBlockArguments.md#networkmask)
- [prefix](AllocateCidrBlockArguments.md#prefix)
- [seed](AllocateCidrBlockArguments.md#seed)

## Properties

### exclusions

• `Optional` **exclusions**: `string`[]

CIDR blocks that should be excluded from the results.

**`Remarks`**

If the CIDR block generated matches any of the values provided here, the method will re-generate and re-check against this list until it runs out of options.
Note that for a given prefix and network mask, only 256 unique CIDR blocks can be generated.

#### Defined in

[cidr/allocate-cidr-block.ts:69](https://github.com/tinystacks/iac-utils/blob/9731283/src/cidr/allocate-cidr-block.ts#L69)

___

### networkMask

• `Optional` **networkMask**: `number`

An integer between 8 and 32

**`Remarks`**

This value will determine how many IP addresses are available within your CIDR block.

**`Default Value`**

16

#### Defined in

[cidr/allocate-cidr-block.ts:61](https://github.com/tinystacks/iac-utils/blob/9731283/src/cidr/allocate-cidr-block.ts#L61)

___

### prefix

• `Optional` **prefix**: `string`

An IPv4 prefix for the CIDR block to use as a base.

**`Remarks`**

Depending on the network mask, one of the octets will likely be replaced.
This should typically be from the Private Address Space defined in RFC 1918 [http://www.faqs.org/rfcs/rfc1918.html](http://www.faqs.org/rfcs/rfc1918.html)

**`Default Value`**

10.0.0.0

#### Defined in

[cidr/allocate-cidr-block.ts:52](https://github.com/tinystacks/iac-utils/blob/9731283/src/cidr/allocate-cidr-block.ts#L52)

___

### seed

• **seed**: `string`

A string to be used as a seed for the CIDR generation.

**`Remarks`**

If all other inputs are the same, two different seeds have a 1 in 256 chance of being duplicates.
If you are generating multiple CIDR blocks and need them to be unique, generate them in sequence providing previously generated blocks in the [exclusions](AllocateCidrBlockArguments.md#exclusions) argument.

#### Defined in

[cidr/allocate-cidr-block.ts:42](https://github.com/tinystacks/iac-utils/blob/9731283/src/cidr/allocate-cidr-block.ts#L42)

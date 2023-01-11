[@tinystacks/iac-utils](../README.md) / [Exports](../modules.md) / CidrBlockAllocation

# Interface: CidrBlockAllocation

Return value for allocateCidrBlock.

## Table of contents

### Properties

- [cidrBlock](CidrBlockAllocation.md#cidrblock)
- [networkMask](CidrBlockAllocation.md#networkmask)
- [prefix](CidrBlockAllocation.md#prefix)
- [seed](CidrBlockAllocation.md#seed)

## Properties

### cidrBlock

• **cidrBlock**: `string`

The CIDR range that was generated.

**`Example`**

```ts
10.0.0.0/16
```

#### Defined in

[cidr/allocate-cidr-block.ts:12](https://github.com/tinystacks/iac-utils/blob/9731283/src/cidr/allocate-cidr-block.ts#L12)

___

### networkMask

• **networkMask**: `number`

The network mask of the CIDR range (integer representing the range of the CIDR block).

**`Example`**

```ts
16
```

#### Defined in

[cidr/allocate-cidr-block.ts:28](https://github.com/tinystacks/iac-utils/blob/9731283/src/cidr/allocate-cidr-block.ts#L28)

___

### prefix

• **prefix**: `string`

The IP prefix of the CIDR range (IPv4 address of the start of the range).

**`Example`**

```ts
10.0.0.0
```

#### Defined in

[cidr/allocate-cidr-block.ts:22](https://github.com/tinystacks/iac-utils/blob/9731283/src/cidr/allocate-cidr-block.ts#L22)

___

### seed

• **seed**: `string`

The seed used to generate this CIDR block.

#### Defined in

[cidr/allocate-cidr-block.ts:16](https://github.com/tinystacks/iac-utils/blob/9731283/src/cidr/allocate-cidr-block.ts#L16)

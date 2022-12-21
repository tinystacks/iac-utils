[@tinystacks/iac-utils](README.md) / Exports

# @tinystacks/iac-utils

## Table of contents

### Enumerations

- [Casing](enums/Casing.md)

### Classes

- [NameValidationResponse](classes/NameValidationResponse.md)

### Interfaces

- [AllocateCidrBlockArguments](interfaces/AllocateCidrBlockArguments.md)
- [CidrBlockAllocation](interfaces/CidrBlockAllocation.md)
- [GenerateNameArguments](interfaces/GenerateNameArguments.md)
- [NameRestriction](interfaces/NameRestriction.md)

### Variables

- [alphaNumericAndHyphen](modules.md#alphanumericandhyphen)
- [alphaNumericAndHyphenAllowedCharacterTypes](modules.md#alphanumericandhyphenallowedcharactertypes)
- [alphaNumericOnly](modules.md#alphanumericonly)
- [alphaNumericOnlyAllowedCharacters](modules.md#alphanumericonlyallowedcharacters)
- [resourceNameRules](modules.md#resourcenamerules)

### Functions

- [allocateCidrBlock](modules.md#allocatecidrblock)
- [allocateSubnetMask](modules.md#allocatesubnetmask)
- [constantCase](modules.md#constantcase)
- [constructId](modules.md#constructid)
- [generateName](modules.md#generatename)
- [kebabCase](modules.md#kebabcase)
- [titleCase](modules.md#titlecase)
- [truncateWithSemiHash](modules.md#truncatewithsemihash)
- [validateName](modules.md#validatename)

## Variables

### alphaNumericAndHyphen

• `Const` **alphaNumericAndHyphen**: `RegExp`

#### Defined in

[naming/naming-restrictions.ts:3](https://github.com/tinystacks/iac-utils/blob/a4b1b24/src/naming/naming-restrictions.ts#L3)

___

### alphaNumericAndHyphenAllowedCharacterTypes

• `Const` **alphaNumericAndHyphenAllowedCharacterTypes**: ``"alphanumeric characters and hyphens"``

#### Defined in

[naming/naming-restrictions.ts:4](https://github.com/tinystacks/iac-utils/blob/a4b1b24/src/naming/naming-restrictions.ts#L4)

___

### alphaNumericOnly

• `Const` **alphaNumericOnly**: `RegExp`

#### Defined in

[naming/naming-restrictions.ts:5](https://github.com/tinystacks/iac-utils/blob/a4b1b24/src/naming/naming-restrictions.ts#L5)

___

### alphaNumericOnlyAllowedCharacters

• `Const` **alphaNumericOnlyAllowedCharacters**: ``"alphanumeric characters"``

#### Defined in

[naming/naming-restrictions.ts:6](https://github.com/tinystacks/iac-utils/blob/a4b1b24/src/naming/naming-restrictions.ts#L6)

___

### resourceNameRules

• `Const` **resourceNameRules**: `Object`

#### Index signature

▪ [provider: `string`]: { `[resourceType: string]`: [`NameRestriction`](interfaces/NameRestriction.md);  }

#### Defined in

[naming/naming-restrictions.ts:8](https://github.com/tinystacks/iac-utils/blob/a4b1b24/src/naming/naming-restrictions.ts#L8)

## Functions

### allocateCidrBlock

▸ **allocateCidrBlock**(`args`): [`CidrBlockAllocation`](interfaces/CidrBlockAllocation.md)

Deterministically generate a CIDR block range.

**`Remarks`**

Given the same inputs, it will generate the same output.
This can be useful if you need to create mutiple VPCs that need to be peered since peered VPCs cannot have overlapping CIDR ranges.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `args` | [`AllocateCidrBlockArguments`](interfaces/AllocateCidrBlockArguments.md) | [AllocateCidrBlockArguments](interfaces/AllocateCidrBlockArguments.md) |

#### Returns

[`CidrBlockAllocation`](interfaces/CidrBlockAllocation.md)

CidrBlockAllocation - [CidrBlockAllocation](interfaces/CidrBlockAllocation.md)

#### Defined in

[cidr/allocate-cidr-block.ts:173](https://github.com/tinystacks/iac-utils/blob/a4b1b24/src/cidr/allocate-cidr-block.ts#L173)

___

### allocateSubnetMask

▸ **allocateSubnetMask**(`cidrMask`, `subnetCount`): `number`

Given the subnet mask of a cidr range and the number of desired subnets, this function will calculate the largest possible mask for the count of subnets to fit within the cidr range.

**`Example`**

```ts
allocateSubnetMask(16, 4) // => 18
allocateSubnetMask(24, 4) // => 26
allocateSubnetMask(16, 18) // => 21
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cidrMask` | `number` | number |
| `subnetCount` | `number` | number |

#### Returns

`number`

number

#### Defined in

[cidr/allocate-subnet-mask.ts:13](https://github.com/tinystacks/iac-utils/blob/a4b1b24/src/cidr/allocate-subnet-mask.ts#L13)

___

### constantCase

▸ **constantCase**(`input?`): `string`

Takes a string and converts it to CONSTANT_CASE

**`Default Value`**

''

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `input` | `string` | `''` | string |

#### Returns

`string`

string

#### Defined in

[string-manipulation/constant-case.ts:9](https://github.com/tinystacks/iac-utils/blob/a4b1b24/src/string-manipulation/constant-case.ts#L9)

___

### constructId

▸ **constructId**(`...identifiers`): `string`

Takes 1 or more string identifiers and returns a string in our standard construct id format.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `...identifiers` | `string`[] | ...string |

#### Returns

`string`

constructId - string

#### Defined in

[naming/construct-id.ts:9](https://github.com/tinystacks/iac-utils/blob/a4b1b24/src/naming/construct-id.ts#L9)

___

### generateName

▸ **generateName**(`args`): `string`

Generates a name by:
 - concatenating a unique copy of the provided identifiers with the provided separator
 - converting to the specified case
 - removing restricted characters
 - truncating the result with a semi-hash for uniqueness if it exceeds the character limit

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `args` | [`GenerateNameArguments`](interfaces/GenerateNameArguments.md) | [GenerateNameArguments](interfaces/GenerateNameArguments.md) |

#### Returns

`string`

string

#### Defined in

[naming/generate-name.ts:38](https://github.com/tinystacks/iac-utils/blob/a4b1b24/src/naming/generate-name.ts#L38)

___

### kebabCase

▸ **kebabCase**(`input?`): `string`

Takes a string and converts it to kebab-case

**`Default Value`**

''

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `input` | `string` | `''` | string |

#### Returns

`string`

string

#### Defined in

[string-manipulation/kebab-case.ts:7](https://github.com/tinystacks/iac-utils/blob/a4b1b24/src/string-manipulation/kebab-case.ts#L7)

___

### titleCase

▸ **titleCase**(`input?`): `string`

Takes a string and converts it to TitleCase

**`Default Value`**

''

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `input` | `string` | `''` | string |

#### Returns

`string`

string

#### Defined in

[string-manipulation/title-case.ts:10](https://github.com/tinystacks/iac-utils/blob/a4b1b24/src/string-manipulation/title-case.ts#L10)

___

### truncateWithSemiHash

▸ **truncateWithSemiHash**(`name`, `maxLength`): `string`

Takes a name and a maximum length and returns a string of that length.
If the name parameter's length is greater than the specified max lenght it will be truncated and the last 8 characters will be replaced with the last 8 characters of the md5 hash of the original value for name.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` | string |
| `maxLength` | `number` | number |

#### Returns

`string`

string

#### Defined in

[naming/truncate-w-hash.ts:10](https://github.com/tinystacks/iac-utils/blob/a4b1b24/src/naming/truncate-w-hash.ts#L10)

___

### validateName

▸ **validateName**(`name?`, `nameRestriction?`, `label?`): [`NameValidationResponse`](classes/NameValidationResponse.md)

Validates a name against a NameRestriction.
Returns a response with a boolean property indicating validity and a string property with a human readable reason for invalidity.

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `name` | `string` | `''` |
| `nameRestriction` | [`NameRestriction`](interfaces/NameRestriction.md) | `{}` |
| `label` | `string` | `'Name'` |

#### Returns

[`NameValidationResponse`](classes/NameValidationResponse.md)

#### Defined in

[naming/validate-name.ts:19](https://github.com/tinystacks/iac-utils/blob/a4b1b24/src/naming/validate-name.ts#L19)

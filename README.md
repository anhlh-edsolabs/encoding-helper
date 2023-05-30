# Encoding Helper

Utility functions for BankingProduct smart contract

---

## I. Usage

### 1. Installation

```Bash
yarn add -D encoding-helper
```

### 2. Import the library in your script

- Import the entire library:

```Javascript
const encodingHelper = require('encoding-helper');
```

- Import only the necessary functions, example:

```Javascript
const { encodeName, decodeId, keccak256 } = require('encoding-helper');
```

---

## II. Function list

### **A. EncodingHelper**

#### 1. `toBytes10Name(name: string): string`

Convert a string with maximum 10 characters into a 10-bytes hex string.
If the input string length is less than 10 characters, the result will be padded with trailing zeros, while with input string greater than 10 characters, the excess will be truncated before encoding.

- Example:

```Javascript
encodingHelper.toBytes10Name("Lorem")
==> '0x4c6f72656d0000000000'

encodingHelper.toBytes10Name("LoremIpsumDolorSit")
==> '0x4c6f72656d497073756d'
```

#### 2. `first10(address: string): string`

Get the first 10-byte string from an address string.

- Example:

```Javascript
encodingHelper.first10('0xECEfEf2074f56ced5A5e68De3Aff44ed5798B35E')
==> '0xecefef2074f56ced5a5e'
```

#### 3. `getId(name: string, index: uint16, token: string, product: string): BigNumber`

Generate a BigNumber `id` from a `name`, an `index`, a `token address`, and a `product contract address`.

- Example:

```Javascript
encodingHelper.getId('Lorem', 65535, '0xDEF0e171272f6f906163a2ab4cd82a3fF85a3972','0x6846ceF88276D453e38B92F4BFe70D29643571B8')

==> BigNumber {
        _hex: '0x4c6f72656d0000000000ffffdef0e171272f6f9061636846cef88276d453e38b',
        _isBigNumber: true
    }
==> '34572686050035833475315598151429145236062344499814420574865813453149958300555'
```

#### 4. `last10(id: BigNumber): string`

Get the last 10-byte string from an `id`. Usually used for validating the `product contract address`.

- Example:

```Javascript
let id = encodingHelper.getId('Lorem', 65535,'0xDEF0e171272f6f906163a2ab4cd82a3fF85a3972','0x6846ceF88276D453e38B92F4BFe70D29643571B8');

encodingHelper.last10(id);
==> '0x6846cef88276d453e38b'
```

#### 5. `decodeId(id: BigNumber): string[]`

Recover the information used to generate the `id`.

- Example:

```Javascript
let id = encodingHelper.getId('Lorem', 65535,'0xDEF0e171272f6f906163a2ab4cd82a3fF85a3972','0x6846ceF88276D453e38B92F4BFe70D29643571B8');
==> BigNumber {
        _hex: '0x4c6f72656d0000000000ffffdef0e171272f6f9061636846cef88276d453e38b',
        _isBigNumber: true
    }
==> '34572686050035833475315598151429145236062344499814420574865813453149958300555'

encodingHelper.decodeId(id);
==> [
        'Lorem', 65535,
        '0xdef0e171272f6f906163',
        '0x6846cef88276d453e38b'
    ]
```

#### 6. `keccak256(input: string): string`

Returns the keccak256 hash of the input string. This function is a shortcut to `ethers.utils.keccak256(BytesLike)` from ethers.js library.

- Example:

```Javascript
encodingHelper.keccak256("Lorem");
==> '0x53e60f9a9472b58c06a7620335d85ec3c20c4f93c0ac735d7a6622f2ef5b67c6'
```

#### 7. `pack(types: string[], values: any[]): string`

This is a short cut to `ethers.utils.solidityPack(string[], any[])`.

- Example:

```Javascript
hashingHelper.pack(["address", "string"], ['0xDEF0e171272f6f906163a2ab4cd82a3fF85a3972', "LoremIpsum"]);
==> '0xdef0e171272f6f906163a2ab4cd82a3ff85a39724c6f72656d497073756d'
```

#### 8. `stringToBytes(input: string, length: uint): string`

Convert the UTF-8 `input` string into a hex string representation of a bytes value with specified `length`.
The `length` must not exceed `input`'s length.

- Example:

```Javascript
encodingHelper.stringToBytes('Lorem Ipsum dolor sit amet. Consectetur adispicing elit', 10);
==> '0x4c6f72656d2049707375'
```

#### 9. `hexToString(hexString: string): string`

Convert a `hexString` value into UTF-8 string and remove any `null` characters from the result.

- Example:

```Javascript
encodingHelper.hexToString('0x4c6f72656d2049707375');
==> 'Lorem Ipsu'

encodingHelper.hexToString('0x4c6f72656d0000000000');
==> 'Lorem'
```

---

### **B. HashingHelper**

#### 1. `toRoleHash(address: string, name: string): string`

Calculate a Hash based on current `account/contract address` and a `name` string.

- Example:

```Javascript
hashingHelper.toRoleHash('0xDEF0e171272f6f906163a2ab4cd82a3fF85a3972', 'DEFAULT_SETTER_ROLE');
==> '0x6346e2e51a432d68c7d12ad11ff4bdf844f7e26e092c0d9787d0397d116098e1'
```

#### 3. `toBytes32Key(keyString: string): string`

Convert `keyString` string into a 32-bytes Hex string.

- Example:

```Javascript
hashingHelper.toBytes32Key('Lorem Ipsum dolor sit amet. Cons');
==> '0x4c6f72656d20497073756d20646f6c6f722073697420616d65742e20436f6e73'
```

If the input string is longer than 32 bytes, only the first 32 bytes will be used to create the bytes32 value.

```Javascript
hashingHelper.toBytes32Key('Lorem Ipsum dolor sit amet. Consectetur adispicing elit')
==> '0x4c6f72656d20497073756d20646f6c6f722073697420616d65742e20436f6e73'
```

#### 4. `toBytes32Value(nameString: string, index: uint16, address: string): string`

Pack the first 10 bytes of the `nameString`, the `uint16` representation of `index`, and the `address` string into a bytes32 value.

- Example:

```Javascript
hashingHelper.toBytes32Value('LoremIpsum', 65535, '0xDEF0e171272f6f906163a2ab4cd82a3fF85a3972');
==> '0x4c6f72656d497073756dffffdef0e171272f6f906163a2ab4cd82a3ff85a3972'
```

#### 5. `recoverOriginalValues(bytes32HexValue: hexString): (string | numbere)[]`

Recover the data that was packed in the previous function `toBytes32Value`

- Example:

```Javascript
hashingHelper.recoverOriginalValues('0x4c6f72656d497073756dffffdef0e171272f6f906163a2ab4cd82a3ff85a3972');
==> [ 
        'LoremIpsum', 
        65535, 
        '0xDEF0e171272f6f906163a2ab4cd82a3fF85a3972' 
    ]
```
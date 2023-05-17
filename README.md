# Encoding Helper
Utility functions for BankingProduct smart contract

---

#### I. Usage
##### 1. Installation
```
yarn add -D encoding-helper
```
##### 2. Import the library in your script
- Import the entire library:
```
const encodingHelper = require('encoding-helper');
```

- Import only the necessary functions, example:
```
const { encodeName, decodeId, keccak256 } = require('encoding-helper');
```

#### II. Function list
##### 1. `encodeName(name: string): string`
Convert a string with maximum 10 characters into a 10-bytes hex string. 
If the input string length is less than 10 characters, the result will be padded with trailing zeros, while with input string greater than 10 characters, the excess will be truncated before encoding.
- Example: 
```
encodingHelper.encodeName("Lorem")
==> '0x4c6f72656d0000000000'

encodingHelper.encodeName("LoremIpsumDolorSit")
==> '0x4c6f72656d497073756d'
```

##### 2. `first10(address: string): string`
Get the first 10-byte string from an address string.
- Example: 
```
encodingHelper.first10('0xECEfEf2074f56ced5A5e68De3Aff44ed5798B35E')
==> '0xecefef2074f56ced5a5e'
```

##### 3. `getId(name: string, index: uint16, token: string, product: string): BigNumber`
Generate a BigNumber `id` from a `name`, an `index`, a `token address`, and a `product contract address`.
- Example:
```
encodingHelper.getId('Lorem', 65535, '0xDEF0e171272f6f906163a2ab4cd82a3fF85a3972','0x6846ceF88276D453e38B92F4BFe70D29643571B8')

==> BigNumber {
        _hex: '0x4c6f72656d0000000000ffffdef0e171272f6f9061636846cef88276d453e38b',
        _isBigNumber: true
    }
==> '34572686050035833475315598151429145236062344499814420574865813453149958300555'
```

##### 4. `last10(id: BigNumber): string`
Get the last 10-byte string from an `id`. Usually used for validating the `product contract address`.
- Example: 
```
let id = encodingHelper.getId('Lorem', 65535,'0xDEF0e171272f6f906163a2ab4cd82a3fF85a3972','0x6846ceF88276D453e38B92F4BFe70D29643571B8');

encodingHelper.last10(id);
==> '0x6846cef88276d453e38b'
```

##### 5. `decodeId(id: BigNumber): string[]`
Recover the information used to generate the `id`.
- Example:
```
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

##### 6. `keccak256(input: string): string`
Returns the keccak256 hash of the input string. This function is a shortcut to `ethers.utils.keccak256(BytesLike)` from ethers.js library.

- Example:
```
encodingHelper.keccak256("Lorem");
==> '0x53e60f9a9472b58c06a7620335d85ec3c20c4f93c0ac735d7a6622f2ef5b67c6'
```
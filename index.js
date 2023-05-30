const {
    toBytes10Name,
    first10,
    last10,
    getId,
    decodeId,
    keccak256,
    pack,
    stringToBytes,
    hexToString,
    ADDRESS_0,
} = require("./src/encodingHelper");

const {
    toRoleHash,
    toBytes32Key,
    toBytes32Value,
    recoverOriginalValues,
} = require("./src/hashingHelper");

module.exports = {
    encodingHelper: {
        toBytes10Name,
        first10,
        last10,
        getId,
        decodeId,
        keccak256,
        pack,
        stringToBytes,
        hexToString,
        ADDRESS_0,
    },
    hashingHelper: {
        toRoleHash,
        toBytes32Key,
        toBytes32Value,
        recoverOriginalValues,
    },
    toBytes10Name,
    first10,
    last10,
    getId,
    decodeId,
    keccak256,
    pack,
    stringToBytes,
    hexToString,
    toRoleHash,
    toBytes32Key,
    toBytes32Value,
    recoverOriginalValues,
    ADDRESS_0,
};

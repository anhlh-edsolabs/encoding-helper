const { utils } = require("ethers");
const {
    pack,
    stringToBytes,
    hexToString,
    toBytes10Name,
} = require("./encodingHelper");

function toRoleHash(address, name) {
    return utils.keccak256(
        pack(["address", "string"], [utils.getAddress(address), name])
    );
}

function toBytes32Key(keyString) {
    return stringToBytes(keyString, 32);
}

function toBytes32Value(nameString, index, address) {
    return pack(
        ["bytes10", "uint16", "address"],
        [toBytes10Name(nameString), index, address]
    );
}

function recoverOriginalValues(bytes32HexValue) {
    let bytesArrayValue = utils.arrayify(bytes32HexValue);
    let nameString = hexToString(utils.hexlify(bytesArrayValue.slice(0, 10)));
    let index = parseInt(utils.hexlify(bytesArrayValue.slice(10, 12)));
    let address = utils.getAddress(
        utils.hexlify(bytesArrayValue.slice(12, 32))
    );

    return [nameString, index, address];
}

module.exports = {
    toRoleHash,
    toBytes32Key,
    toBytes32Value,
    recoverOriginalValues,
};

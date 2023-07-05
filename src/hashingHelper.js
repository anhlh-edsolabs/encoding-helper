const { utils } = require("ethers");
const { encodingHelper } = require("./encodingHelper");

function toRoleHash(address, name) {
    return utils.keccak256(
        encodingHelper.pack(
            ["address", "string"],
            [utils.getAddress(address), name]
        )
    );
}

function toBytes32Key(keyString) {
    return encodingHelper.stringToBytes(keyString, 32);
}

function toBytes32Value(nameString, index, address) {
    return encodingHelper.pack(
        ["bytes10", "uint16", "address"],
        [encodingHelper.toBytes10Name(nameString), index, address]
    );
}

function recoverOriginalValues(bytes32HexValue) {
    let bytesArrayValue = utils.arrayify(bytes32HexValue);
    let nameString = encodingHelper.hexToString(
        utils.hexlify(bytesArrayValue.slice(0, 10))
    );
    let index = parseInt(utils.hexlify(bytesArrayValue.slice(10, 12)));
    let address = utils.getAddress(
        utils.hexlify(bytesArrayValue.slice(12, 32))
    );

    return [nameString, index, address];
}

module.exports = {
    hashingHelper: {
        toRoleHash,
        toBytes32Key,
        toBytes32Value,
        recoverOriginalValues,
    },
};

const { BigNumber, utils } = require("ethers");

const ADDRESS_0 = "0x0000000000000000000000000000000000000000";

function toBytes10Name(name) {
    // Take only the first 10 elements of the Uint8Array
    // returned by the `utils.arrayify()`.
    return stringToBytes(name, 10);
}

function first10(address) {
    return utils.hexlify(utils.arrayify(address).slice(0, 10));
}

function last10(id) {
    let byteArrayId = utils.arrayify(id);
    return utils.hexlify(byteArrayId.slice(22, 32));
}

function getId(name, index, token, product) {
    return BigNumber.from(
        utils.solidityPack(
            ["bytes10", "uint16", "bytes10", "bytes10"],
            [toBytes10Name(name), index, first10(token), first10(product)]
        )
    );
}

function decodeId(id) {
    // convert the BigNumber id into and Uint8Array and zero pad it to compensate any missing length of bytes32
    let bytesArrayId = utils.zeroPad(utils.arrayify(id), 32);
    let name = hexToString(utils.hexlify(bytesArrayId.slice(0, 10)));
    let index = parseInt(utils.hexlify(bytesArrayId.slice(10, 12)));
    let token = utils.hexlify(bytesArrayId.slice(12, 22));
    let product = utils.hexlify(bytesArrayId.slice(22, 32));

    return [name, index, token, product];
}

function keccak256(input) {
    return utils.keccak256(utils.toUtf8Bytes(input));
}

function pack(types, values) {
    return utils.solidityPack(types, values);
}

function stringToBytes(input, length) {
    let bytesValue = utils.toUtf8Bytes(input);

    bytesValue =
        bytesValue.length < length
            ? utils.arrayify(utils.formatBytes32String(input)).slice(0, length)
            : utils.arrayify(pack(["string"], [input])).slice(0, length);
    
    return utils.hexlify(bytesValue);
}

function hexToString(hexString) {
    return utils.toUtf8String(hexString).replace(/(\x00)/g, "");
}

module.exports = {
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
};

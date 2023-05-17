const ethers = require("ethers");

const ADDRESS_0 = "0x0000000000000000000000000000000000000000";

function encodeName(name) {
    return ethers.utils.hexlify(
        ethers.utils
            .stripZeros(ethers.utils.formatBytes32String(name))
            .slice(0, 10)
    );
}

function first10(address) {
    return ethers.utils.hexlify(ethers.utils.stripZeros(address).slice(0, 10));
}

function last10(id) {
    let byteArrayId = ethers.utils.stripZeros(id);
    return ethers.utils.hexlify(byteArrayId.slice(22, 32));
}

function getId(name, index, token, product) {
    return ethers.BigNumber.from(
        ethers.utils.solidityPack(
            ["bytes10", "uint16", "bytes10", "bytes10"],
            [encodeName(name), index, first10(token), first10(product)]
        )
    );
}

function decodeId(id) {
    let byteArrayId = ethers.utils.stripZeros(id);
    let name = ethers.utils
        .toUtf8String(ethers.utils.hexlify(byteArrayId.slice(0, 10)))
        .replace(/(\x00)/g, "");
    let index = parseInt(ethers.utils.hexlify(byteArrayId.slice(10, 12)));
    let token = ethers.utils.hexlify(byteArrayId.slice(12, 22));
    let product = ethers.utils.hexlify(byteArrayId.slice(22, 32));

    return [name, index, token, product];
}

function keccak256(input) {
    return ethers.utils.keccak256(ethers.utils.toUtf8Bytes(input));
}

module.exports = {
    encodeName,
    first10,
    last10,
    getId,
    decodeId,
    keccak256,
    ADDRESS_0,
};

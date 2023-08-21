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
    // convert the BigNumber id into an Uint8Array and zero pad it to compensate any missing length of bytes32
    let _id = utils.zeroPad(utils.arrayify(BigNumber.from(id)), 32);
    let name = hexToString(utils.hexlify(_id.slice(0, 10)));
    let index = parseInt(utils.hexlify(_id.slice(10, 12)));
    let token = utils.hexlify(_id.slice(12, 22));
    let product = utils.hexlify(_id.slice(22, 32));

    return [name, index, token, product];
}

function keccak256(input) {
    if (typeof input === "string") {
        if (input.match(/^-?0x[0-9a-f]+$/i)) {
            return utils.keccak256(input);
        } else {
            return utils.keccak256(utils.toUtf8Bytes(input));
        }
    } else {
        return utils.keccak256(input);
    }
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

/** @notice Obsoleted */
function encodePayload(name, index, token, product, account) {
    let id = utils.zeroPad(getId(name, index, token, product), 32);
    let targetToken = utils.zeroPad(token, 32);
    let targetproduct = utils.zeroPad(product, 32);
    let recipient = utils.zeroPad(account, 32);

    return pack(
        ["bytes32", "bytes32", "bytes32", "bytes32"],
        [id, targetToken, targetproduct, recipient]
    );
}

/** @notice Obsoleted */
function decodePayload(payloadHex) {
    let _payload = utils.arrayify(payloadHex);

    let id = utils.hexDataSlice(_payload, 0, 32);
    let targetToken = utils.defaultAbiCoder.decode(
        ["address"],
        utils.hexDataSlice(_payload, 32, 64)
    );
    let targetProduct = utils.defaultAbiCoder.decode(
        ["address"],
        utils.hexDataSlice(_payload, 64, 96)
    );
    let recipient = utils.defaultAbiCoder.decode(
        ["address"],
        utils.hexDataSlice(_payload, 96, 128)
    );

    return [decodeId(id), id, targetToken, targetProduct, recipient];
}

function encodeBankPayload(name, index, token, product, account) {
    let id = utils.zeroPad(getId(name, index, token, product), 32);

    return utils.defaultAbiCoder.encode(
        ["bytes32", "address", "address", "address"],
        [id, token, product, account]
    );
}

function decodeBankPayload(payloadHex) {
    let _payloadArray = utils.defaultAbiCoder.decode(
        ["bytes32", "address", "address", "address"],
        payloadHex
    );

    return _spreadPayloadData(_payloadArray);
}

function encodeCryptoPayload(name, index, token, product, autoswap = false) {
    let id = utils.zeroPad(getId(name, index, token, product), 32);

    return utils.defaultAbiCoder.encode(
        ["bytes32", "address", "address", "bool"],
        [id, token, product, autoswap]
    );
}

function decodeCryptoPayload(payloadHex) {
    let _payloadArray = utils.defaultAbiCoder.decode(
        ["bytes32", "address", "address", "bool"],
        payloadHex
    );

    return _spreadPayloadData(_payloadArray);
}

function _spreadPayloadData(decodedPayload) {
    let id = decodedPayload[0];

    return [decodeId(id), ...decodedPayload];
}

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
        encodePayload,
        decodePayload,
        encodeBankPayload,
        decodeBankPayload,
        encodeCryptoPayload,
        decodeCryptoPayload,
        ADDRESS_0,
    },
};

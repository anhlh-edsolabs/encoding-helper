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
            [
                stringToBytes10orHash(name),
                index,
                first10(token),
                first10(product),
            ]
        )
    );
}

function decodeId(id) {
    // convert the BigNumber id into an Uint8Array and zero pad it to compensate any missing length of bytes32
    let _id = utils.zeroPad(utils.arrayify(BigNumber.from(id)), 32);
    let nameSlice = _id.slice(0, 10);

    let name;
    try {
        name = hexToString(utils.hexlify(nameSlice));
    } catch (err) {
        name = utils.hexlify(nameSlice);
    }
    let index = parseInt(utils.hexlify(_id.slice(10, 12)));
    let token = utils.hexlify(_id.slice(12, 22));
    let product = utils.hexlify(_id.slice(22, 32));

    return [name, index, token, product];
}

function getProductId(name, token, product) {
    const nameHashed = stringToBytes10orHash(name);

    return utils.solidityPack(
        ["bytes10", "uint16", "bytes10", "bytes10"],
        [nameHashed, 0, first10(token), first10(product)]
    );
}

function getNameHashFromId(hexId) {
    return utils.hexDataSlice(hexId, 0, 10);
}

function verifyProductId(id, name, token, product) {
    let _id = utils.arrayify(id);
    let faults = 0;
    let nameBytes10 = utils.hexlify(_id.slice(0, 10));
    try {
        faults = hexToString(nameBytes10) != name ? (faults += 1) : faults;
    } catch (err) {
        // faults += 1;
        const encodedName = utils.hexDataSlice(
            keccak256(utils.toUtf8Bytes(name)),
            0,
            10
        );
        faults = nameBytes10 != encodedName ? (faults += 1) : faults;
    }
    if (!utils.isAddress(token)) {
        throw new Error("Invalid token address");
    }
    if (!utils.isAddress(product)) {
        throw new Error("Invalid product address");
    }
    faults =
        first10(token) != utils.hexlify(_id.slice(12, 22))
            ? (faults += 1)
            : faults;

    faults =
        first10(product) != utils.hexlify(_id.slice(22, 32))
            ? (faults += 1)
            : faults;

    return faults == 0;
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

function stringToBytes10orHash(input) {
    const inputUtf8Bytes = utils.toUtf8Bytes(input);

    return inputUtf8Bytes.length <= 10
        ? toBytes10Name(input)
        : utils.hexDataSlice(keccak256(inputUtf8Bytes), 0, 10);
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
        getProductId,
        getNameHashFromId,
        verifyProductId,
        stringToBytes10orHash,
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

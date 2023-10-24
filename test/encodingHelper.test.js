const { expect } = require("chai");
const { BigNumber } = require("ethers");
const { encodingHelper } = require("../");

describe("Encoding Helper", () => {
    describe("toBytes10Name", () => {
        it("should convert a name to bytes10 format", () => {
            const name = "JohnDoe";
            const result = encodingHelper.toBytes10Name(name);
            const expected = "0x4a6f686e446f65000000";
            expect(result).to.equal(expected);
        });
    });

    describe("first10", () => {
        it("should extract the first 10 bytes from an address", () => {
            const address = "0x1234567890123456789012345678901234567890";
            const result = encodingHelper.first10(address);
            const expected = "0x12345678901234567890";
            expect(result).to.equal(expected);
        });
    });

    describe("last10", () => {
        it("should extract the last 10 bytes from a bytes32 value", () => {
            const id =
                "0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef";
            const result = encodingHelper.last10(id);
            const expected = "0xcdef0123456789abcdef";
            expect(result).to.equal(expected);
        });
    });

    describe("getId", () => {
        it("should generate an ID from the given parameters", () => {
            const name = "JohnDoe";
            const index = 42;
            const token = "0xabcdef0123456789abcdef0123456789abcdef01";
            const product = "0x0123456789abcdef0123456789abcdef01234567";
            const result = encodingHelper.getId(name, index, token, product);
            const expected = BigNumber.from(
                "0x4a6f686e446f65000000002aabcdef0123456789abcd0123456789abcdef0123"
            );
            expect(result).to.deep.equal(expected);
        });
    });

    describe("decodeId", () => {
        it("should decode the ID into its components", () => {
            const id = BigNumber.from(
                "0x4a6f686e446f65000000002aabcdef0123456789abcd0123456789abcdef0123"
            );
            const result = encodingHelper.decodeId(id);
            const expected = [
                "JohnDoe",
                42,
                "0xabcdef0123456789abcd",
                "0x0123456789abcdef0123",
            ];
            expect(result).to.deep.equal(expected);
        });
    });

    describe("getProductId", () => {
        it("should generate a product ID from the given parameters", () => {
            const name = "JohnDoe";
            const token = "0xabcdef0123456789abcdef0123456789abcdef01";
            const product = "0x0123456789abcdef0123456789abcdef01234567";
            const result = encodingHelper.getProductId(name, token, product);
            const expected =
                "0x4a6f686e446f650000000000abcdef0123456789abcd0123456789abcdef0123";
            expect(result).to.equal(expected);
        });
    });

    describe("encodeCryptoPayload", () => {
        it("should encode a crypto payload with autoswap set to false", () => {
            const name = "JohnDoe";
            const index = 42;
            const token = "0xabcdef0123456789abcdef0123456789abcdef01";
            const product = "0x0123456789abcdef0123456789abcdef01234567";
            const autoswap = false;

            const result = encodingHelper.encodeCryptoPayload(
                name,
                index,
                token,
                product,
                autoswap
            );
            const expected =
                "0x4a6f686e446f65000000002aabcdef0123456789abcd0123456789abcdef0123000000000000000000000000abcdef0123456789abcdef0123456789abcdef010000000000000000000000000123456789abcdef0123456789abcdef012345670000000000000000000000000000000000000000000000000000000000000000";
            expect(result).to.equal(expected);
        });

        it("should encode a crypto payload with autoswap set to true", () => {
            const name = "AliceSmith";
            const index = 10;
            const token = "0x0123456789abcdef0123456789abcdef01234567";
            const product = "0xabcdef0123456789abcdef0123456789abcdef01";
            const autoswap = true;

            const result = encodingHelper.encodeCryptoPayload(
                name,
                index,
                token,
                product,
                autoswap
            );
            const expected =
                "0x416c696365536d697468000a0123456789abcdef0123abcdef0123456789abcd0000000000000000000000000123456789abcdef0123456789abcdef01234567000000000000000000000000abcdef0123456789abcdef0123456789abcdef010000000000000000000000000000000000000000000000000000000000000001";
            expect(result).to.equal(expected);
        });
    });
});

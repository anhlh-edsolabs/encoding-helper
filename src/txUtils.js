const { ethers } = require("ethers");

/** Implementation Slot is calculated as follow: 
 * IMPLEMENTATION_SLOT = BigNumber.from(utils.keccak256(Buffer.from('eip1967.proxy.implementation'))).sub(1).toHexString()
 * 
 * Output value: '0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc'
 * */ 
const IMPLEMENTATION_SLOT =
	"0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc";

async function getRevertReason(provider, txnHash) {
    let _provider;
    if (
        typeof provider == "object" &&
        provider._isProvider != undefined &&
        provider._isProvider == true
    ) {
        _provider = provider;
    }
    if (
        typeof provider === "string" &&
        provider.match(/\b(?:https?|http):\/\/\S+\b/gm)
    ) {
        _provider = ethers.providers.getDefaultProvider(provider);
    }

    let txn = await _provider.getTransaction(txnHash);
    let message = "";

    try {
        let result = await _provider.call(txn, txn.blockNumber);
        message = "No revert reason. Result: " + result;
    } catch (err) {
        message = JSON.parse(err.error.body).error.message;
    }

    return message;
}

async function getImplementationAddress(provider, proxyAddress) {
    const impl = await provider.getStorageAt(proxyAddress, IMPLEMENTATION_SLOT);
    return ethers.utils.defaultAbiCoder.decode(["address"], impl)[0];
}

module.exports = { txUtils: { getRevertReason, getImplementationAddress } };

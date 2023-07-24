const { ethers } = require("ethers");
const { log } = require("console");

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

    try {
        let result = await _provider.call(txn, txn.blockNumber);
        log(result);
    } catch (err) {
        log(JSON.parse(err.error.body).error.message);
    }
}

module.exports = { txUtils: { getRevertReason } };

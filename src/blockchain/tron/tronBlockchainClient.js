import BlockchainClient from "./../blockchainClient";
const PaymentGateway = require("./PaymentGateway.json");
const PresaleChestGateway = require("./PresaleChestGateway.json");
const PresaleChestToken = require("./PresaleChestToken.json");
const Presale = require("./Presale.json");
const TronWeb = require("tronweb");

const getParamTypes = params => {
    return params.map(({ type }) => type);
}

const getFunctionSelector = abi => {
    return abi.name + '(' + getParamTypes(abi.inputs || []).join(',') + ')';
}

class TronBlockchainClient extends BlockchainClient {
    constructor() {
        super();

        this._tronWeb = null;
    }

    getAddress() {
        return this._tronWeb.defaultAddress.base58;
    }

    isReady() {
        return this._tronWeb && this._tronWeb.ready;
    }

    async sign(nonce) {
        return await this._tronWeb.trx.sign(this._tronWeb.toHex(nonce));
    }

    async init() {
        try {
            await new Promise((resolve, reject) => {
                let tries = 0;
                // is it possible that injection can be delayed?
                let interval = setInterval(() => {
                    if (!window.tronWeb && tries++ > 10) {
                        clearInterval(interval);
                        reject();
                    } else if (window.tronWeb) {
                        clearInterval(interval);
                        this._tronWeb = window.tronWeb;
                        resolve();
                    }
                }, 100);
            });
        } catch (exc) {
            throw exc;
        }

        this._paymentContract = this._tronWeb.contract(PaymentGateway.abi, PaymentGateway.address);
        this._presaleChestGateway = this._tronWeb.contract(PresaleChestGateway.abi, PresaleChestGateway.address);
        this._presale = this._tronWeb.contract(Presale.abi, Presale.address);
    }

    async fetchOwnedChests() {
        if (!this._chestsContracts) {
            this._chestsContracts = {};
            for (let i = 0; i < 4; i++) {
                let chestData = await this._presale.methods.chestStatus(i).call();
                this._chestsContracts[i] = await this._tronWeb.contract().at(chestData[0]);
            }
        }

        let chests = {};
        for (let i = 0; i < 4; i++) {
            let owned = await this._chestsContracts[i].balanceOf(this._tronWeb.defaultAddress.hex).call();
            chests[i] = owned.toNumber();
        }

        return chests;
    }

    async transferPresaleChests(chestId, chestAmount) {
        return await this._chestsContracts[chestId].sendToGateway(chestAmount).send({ shouldPollResponse: true });
    }

    // TODO automate raw transaction creation of the method from abi
    async purchaseIAP(iap, paymentId, price, signature) {
        let tx = await this._tronWeb.transactionBuilder.triggerSmartContract(PaymentGateway.address, "purchase(string,string,uint256,bytes)", {
            callValue: price
        }, [{
            type: "string",
            value: iap
        }, {
            type: "string",
            value: paymentId
        }, {
            type: "uint256",
            value: price
        }, {
            type: "bytes",
            value: signature
        }]);

        return await this._tronWeb.trx.sign(tx.transaction);
    }
};

export default TronBlockchainClient;
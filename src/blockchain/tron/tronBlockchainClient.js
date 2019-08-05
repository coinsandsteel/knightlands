import BlockchainClient from "./../blockchainClient";
const PaymentGateway = require("./PaymentGateway.json");
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
        await new Promise(resolve => {
            let tries = 0;
            // is it possible that injection can be delayed?
            let interval = setInterval(() => {
                if (!window.tronWeb && tries++ > 10) {
                    const tronWeb = new TronWeb(
                        "https://api.trongrid.io",
                        "https://api.trongrid.io",
                        "https://api.trongrid.io"
                    );
                    window.tronWeb = tronWeb;
                }

                if (window.tronWeb) {
                    clearInterval(interval);
                    this._tronWeb = window.tronWeb;
                    resolve();
                }
            }, 100);
        });

        this._paymentContract = this._tronWeb.contract(PaymentGateway.abi, PaymentGateway.address);
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
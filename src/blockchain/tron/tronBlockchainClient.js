import BlockchainClient from "./../blockchainClient";
const PaymentGateway = require("./PaymentGateway.json");
const PresaleChestGateway = require("./PresaleChestGateway.json");
const PresaleChestToken = require("./PresaleChestToken.json");
const DKT = require("./DKT.json");
const Presale = require("./Presale.json");
const Dividends = require("./Dividends.json");
const TronWeb = require("tronweb");
import { toDecimal, toBigNumber } from "../utils";

const getParamTypes = params => {
    return params.map(({ type }) => type);
}

const getFunctionSelector = abi => {
    return abi.name + '(' + getParamTypes(abi.inputs || []).join(',') + ')';
}

const MaxClaimCycles = 5;

class TronBlockchainClient extends BlockchainClient {
    constructor() {
        super();

        this._tronWeb = null;
        this._tronWasInited = false;
    }

    getAddress() {
        return this._tronWeb.defaultAddress.base58;
    }

    isInited() {
        return this._tronWasInited;
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

        this._tronWasInited = true;

        // await this._initContracts();
    }

    async _initContracts() {
        await new Promise((resolve, reject) => {
            let tries = 0;
            // is it possible that injection can be delayed?
            let interval = setInterval(() => {
                if (this._tronWeb.ready) {
                    clearInterval(interval);
                    resolve();
                } else if (tries++ > 2) {
                    reject();
                }
            }, 500);
        });

        try {
            this._paymentContract = this._tronWeb.contract(PaymentGateway.abi, PaymentGateway.address);
            this._dktContract = this._tronWeb.contract(DKT.abi, DKT.address);
            this._dividendsContract = this._tronWeb.contract(Dividends.abi, Dividends.address);

            if (process.env.NODE_ENV == "production") {
                this._presaleChestGateway = await this._tronWeb.contract().at("TAGCzgmuUGzfgNvaXKsztH9Kqk2rjwvJE4");
                this._presale = await this._tronWeb.contract().at("TUCnRiaydK4h9BMtYZXXjUwNBrDYoXp2FB");
            } else {
                this._paymentContract = await this._tronWeb.contract().at(PaymentGateway.address);
            }
        } catch {}
    }

    async fetchOwnedChests() {
        if (!this._chestsContracts) {
            this._chestsContracts = {};
            for (let i = 0; i < 5; i++) {
                let chestData = await this._presale.methods.chestStatus(i).call();
                this._chestsContracts[i] = await this._tronWeb.contract().at(chestData[0]);
            }
        }

        let chests = {};
        for (let i = 0; i < 5; i++) {
            let owned = await this._chestsContracts[i].balanceOf(this._tronWeb.defaultAddress.hex).call();
            chests[i] = owned.toNumber();
        }

        return chests;
    }

    async transferPresaleChests(chestId, chestAmount) {
        return await this._chestsContracts[chestId].sendToGateway(chestAmount).send({ shouldPollResponse: true });
    }

    // TODO automate raw transaction creation of the method from abi
    async purchaseIAP(iap, paymentId, price, nonce, timestamp, signature) {
        let tx = await this._tronWeb.transactionBuilder.triggerSmartContract(PaymentGateway.address, "purchase(string,string,uint256,uint256,uint256,bytes)", {
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
            type: "uint256",
            value: nonce
        }, {
            type: "uint256",
            value: timestamp
        }, {
            type: "bytes",
            value: signature
        }]);

        return await this._tronWeb.trx.sign(tx.transaction);
    }

    async dividendTokenWithdrawal(amount, nonce, signature) {
        let tx = await this._tronWeb.transactionBuilder.triggerSmartContract(DKT.address, "mint(address,uint256,uint256,bytes)", {
            callValue: 0
        }, [{
            type: "address",
            value: this._tronWeb.defaultAddress.hex
        }, {
            type: "uint256",
            value: amount
        }, {
            type: "uint256",
            value: nonce
        }, {
            type: "bytes",
            value: signature
        }]);

        return await this._tronWeb.trx.sign(tx.transaction);
    }

    async _trackTransactionFailure(txID, resolve, reject) {
        const output = await this._tronWeb.trx.getTransactionInfo(txID);
        console.log(output)
        if (!Object.keys(output).length) {
            return setTimeout(() => {
                this._trackTransactionFailure(txID, resolve, reject);
            }, 2000);
        }

        if ((output.result && output.result == "FAILED") || !output.hasOwnProperty("contractResult")) {
            reject();
        } else {
            resolve();
        }
    }

    async fetchDividendsInfo() {
        // fetch DKT balance
        const dktBalance = await this._dktContract.balanceOf(this._tronWeb.defaultAddress.hex).call();

        // fetch dividends
        const info = await this._dividendsContract.fullInfo(MaxClaimCycles).call();
        const state = await this._dividendsContract.stakeStates(this._tronWeb.defaultAddress.hex).call();
        
        for (let i = 0; i < 3; ++i) {
            // const f = await this._dividendsContract.dividendsSnapshots(i).call();
            // console.log(f, toDecimal(f.totalStaked, 6), toDecimal(f.trxToClaim, 6));
        }

        return {
            dkt: toDecimal(dktBalance, 6),
            state: state,
            totalStaked: toDecimal(info[2], 6),
            freezeDuration: Number(info[1]),
            payoutPeriod: Number(info[0]),
            stakingStart: Number(info[3]),
            payout: toDecimal(info[4], 6),
            totalDivs: toDecimal(info[5], 6)
        };
    }

    async freezeDkt(amount) {
        const tx = await this._dividendsContract.freeze(toBigNumber(amount, 6)).send();
        await new Promise((resolve, reject) => {
            this._trackTransactionFailure(tx, resolve, reject);
        });
    }

    async unfreezeDkt(amount) {
        const tx = await this._dividendsContract.unfreeze(toBigNumber(amount, 6)).send();
        await new Promise((resolve, reject) => {
            this._trackTransactionFailure(tx, resolve, reject);
        });
    }

    async claimDividends() {
        const unclaimedPeriods = await this._getUnclaimedPayoutPeriods();
        let cyclesClaimed = 0;
        while (cyclesClaimed < unclaimedPeriods) {
            let cycles = unclaimedPeriods;
            if (unclaimedPeriods > MaxClaimCycles) {
                cycles = MaxClaimCycles;
            }

            cyclesClaimed += cycles;

            const tx = await this._dividendsContract.claimDividends(cyclesClaimed).send();
            await new Promise((resolve, reject) => {
                this._trackTransactionFailure(tx, resolve, reject);
            });
        }
    }

    async _getUnclaimedPayoutPeriods() {
        return Number(await this._dividendsContract.getUnclaimedPayoutPeriods().call());
    }
};

export default TronBlockchainClient;

import BlockchainClient from "./../blockchainClient";
const PaymentGateway = require("./PaymentGateway.json");
const PresaleChestGateway = require("./PresaleChestGateway.json");
const PresaleChestToken = require("./PresaleChestToken.json");
const DKT = require("./DKT.json");
const Presale = require("./Presale.json");
const Dividends = require("./Dividends.json");
const TronWeb = require("tronweb");
const web3utls = require("web3-utils");
import { toDecimal, toBigNumber } from "../utils";
import { WalletLockedError } from "../WalletErrors";
import Blockchains from "@/../../knightlands-shared/blockchains.js";

const getParamTypes = params => {
  return params.map(({ type }) => type);
};

const getFunctionSelector = abi => {
  return abi.name + "(" + getParamTypes(abi.inputs || []).join(",") + ")";
};

const MaxClaimCycles = 5;

class TronBlockchainClient extends BlockchainClient {
  constructor() {
    super();

    this._tronWeb = null;
    this._tronWasInited = false;
  }

  static isAddress(addr) {
    return web3utls.isAddress(addr);
  }

  getAddress() {
    return this._tronWeb.defaultAddress.base58;
  }

  get id() {
    return Blockchains.Tron;
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

  async unlocked(cancellationToken) {
    // wait for wallet to be unlocked
    return new Promise(resolve => {
      const interval = setInterval(() => {
        if (this.isReady() || cancellationToken.cancelled) {
          clearInterval(interval);
          resolve(true);
        }
      }, 500);
    });
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

    if (!this.isReady()) {
      throw new WalletLockedError();
    }

    this._tronWasInited = true;

    await this._initContracts();
  }

  async _initContracts() {
    try {
      this._paymentContract = this._tronWeb.contract(
        PaymentGateway.abi,
        PaymentGateway.address
      );
      this._dktContract = this._tronWeb.contract(DKT.abi, DKT.address);
      this._dividendsContract = this._tronWeb.contract(
        Dividends.abi,
        Dividends.address
      );

      this._presaleChestGateway = await this._tronWeb
        .contract()
        .at("TAGCzgmuUGzfgNvaXKsztH9Kqk2rjwvJE4");
      this._presale = await this._tronWeb
        .contract()
        .at("TUCnRiaydK4h9BMtYZXXjUwNBrDYoXp2FB");
    } catch (e) {
      console.error(e);
    }
  }

  async fetchOwnedChests() {
    if (!this._chestsContracts) {
      this._chestsContracts = {};
      for (let i = 0; i < 5; i++) {
        let chestData = await this._presale.methods.chestStatus(i).call();
        this._chestsContracts[i] = await this._tronWeb
          .contract()
          .at(chestData[0]);
      }
    }

    let chests = {};
    for (let i = 0; i < 5; i++) {
      let owned = await this._chestsContracts[i]
        .balanceOf(this._tronWeb.defaultAddress.hex)
        .call();
      chests[i] = owned.toNumber();
    }

    return chests;
  }

  async transferPresaleChests(chestId, chestAmount) {
    return await this._chestsContracts[chestId]
      .sendToGateway(chestAmount)
      .send({ shouldPollResponse: true });
  }

  // TODO automate raw transaction creation of the method from abi
  async purchaseIAP(iap, paymentId, price, nonce, timestamp, signature) {
    let tx = await this._tronWeb.transactionBuilder.triggerSmartContract(
      PaymentGateway.address,
      "purchase(string,string,uint256,uint256,uint256,bytes)",
      {
        callValue: price
      },
      [
        {
          type: "string",
          value: iap
        },
        {
          type: "string",
          value: paymentId
        },
        {
          type: "uint256",
          value: price
        },
        {
          type: "uint256",
          value: nonce
        },
        {
          type: "uint256",
          value: timestamp
        },
        {
          type: "bytes",
          value: signature
        }
      ]
    );

    return await this._tronWeb.trx.sign(tx.transaction);
  }

  async dividendTokenWithdrawal(amount, nonce, signature) {
    let tx = await this._tronWeb.transactionBuilder.triggerSmartContract(
      DKT.address,
      "mint(address,uint256,uint256,bytes)",
      {
        callValue: 0
      },
      [
        {
          type: "address",
          value: this._tronWeb.defaultAddress.hex
        },
        {
          type: "uint256",
          value: amount
        },
        {
          type: "uint256",
          value: nonce
        },
        {
          type: "bytes",
          value: signature
        }
      ]
    );

    return await this._tronWeb.trx.sign(tx.transaction);
  }

  async _trackTransactionFailure(txID, resolve, reject) {
    const output = await this._tronWeb.trx.getTransactionInfo(txID);
    console.log(txID);
    if (!Object.keys(output).length) {
      return setTimeout(() => {
        this._trackTransactionFailure(txID, resolve, reject);
      }, 2000);
    }

    if (
      (output.result && output.result == "FAILED") ||
      !output.hasOwnProperty("contractResult")
    ) {
      reject();
    } else {
      resolve();
    }
  }

  async finishDividendsWithdrawal(withdrawalId, amount, nonce, signature) {
    const tx = await this._paymentContract
      .withdrawDivs(withdrawalId, amount, nonce, signature)
      .send({ shouldPollResponse: true });
    // await new Promise((resolve, reject) => {
    //   this._trackTransactionFailure(tx, resolve, reject);
    // });
  }

  async _getUnclaimedPayoutPeriods() {
    return Number(
      await this._dividendsContract.getUnclaimedPayoutPeriods().call()
    );
  }
}

export default TronBlockchainClient;

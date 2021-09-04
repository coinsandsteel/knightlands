import { ethers } from "ethers";
import Blockchains from "@/../../knightlands-shared/blockchains.js";
import BlockchainClient from "./../blockchainClient";
import currency_type from "../../../../knightlands-shared/currency_type";

const PaymentGateway = require("./PaymentGateway.json");
const Flesh = require("./Flesh.json");
const Ash = require("./Ash.json");
const TokensDepositGateway = require("./TokensDepositGateway.json");

import { IncorrectNetworkError } from "../WalletErrors";

const NetworkName = process.env.NODE_ENV == "production" ? "mainnet" : "goerli";

export default class EthereumClient extends BlockchainClient {
  constructor() {
    super();

    this._provider = null;
    this._inited = false;
  }

  static isAddress(addr) {
    return ethers.utils.isAddress(addr);
  }

  getAddress() {
    return this._address;
  }

  get id() {
    return Blockchains.Ethereum;
  }

  isInited() {
    return this._inited;
  }

  isReady() {
    return this._provider && this._tronWeb.ready;
  }

  async init() {
    const provider = new ethers.providers.Web3Provider(
      window.ethereum,
      NetworkName
    );
    provider.on("network", (newNetwork, oldNetwork) => {
      if (oldNetwork) {
        window.location.reload();
      }
    });

    try {
      await provider.getNetwork();
    } catch (e) {
      throw new IncorrectNetworkError(NetworkName);
    }

    this._provider = provider;
    await provider.send("eth_requestAccounts", []);

    this._address = await this._provider.getSigner().getAddress();

    this._paymentContract = new ethers.Contract(
      PaymentGateway.address,
      PaymentGateway.abi,
      provider
    );

    this._tokens = {
      [currency_type.Dkt]: new ethers.Contract(
        Flesh.address,
        Flesh.abi,
        provider
      ),

      [currency_type.Dkt2]: new ethers.Contract(Ash.address, Ash.abi, provider)
    };

    this._tokenGateway = new ethers.Contract(
      TokensDepositGateway.address,
      TokensDepositGateway.abi,
      provider
    );

    this._inited = true;
  }

  async purchaseIAP(iap, paymentId, price, nonce, timestamp, signature) {
    return await this._paymentContract
      .connect(this._provider.getSigner())
      .purchase(iap, paymentId, price, nonce, timestamp, signature, {
        value: ethers.BigNumber.from(price),
        gasLimit: 100000
      });
  }

  async finishDividendsWithdrawal(withdrawalId, amount, nonce, signature) {
    await this._paymentContract
      .connect(this._provider.getSigner())
      .withdrawDivs(this.getAddress(), withdrawalId, amount, nonce, signature);
  }

  async getTokenBalance(type) {
    return this._tokens[type]
      .connect(this._provider.getSigner())
      .balanceOf(this.getAddress());
  }

  async getTokenInfo(type) {
    const decimals = await this._tokens[type]
      .connect(this._provider.getSigner())
      .decimals();
    const symbol = await this._tokens[type]
      .connect(this._provider.getSigner())
      .symbol();
    const address = this._tokens[type].address;
    return {
      decimals,
      address,
      symbol
    };
  }

  getTokenAddress(type) {
    return this._tokens[type].address;
  }

  async finishTokenWithdrawal(type, withdrawalId, amount, nonce, signature) {
    await this._tokens[type]
      .connect(this._provider.getSigner())
      .mint(this.getAddress(), amount, nonce, withdrawalId, signature);
  }

  async depositTokens(type, to, depositorId, amount) {
    await this._tokenGateway
      .connect(this._provider.getSigner())
      .deposit(
        depositorId,
        this._tokens[type].address,
        to,
        Math.floor(amount * Math.pow(10, 6)).toString()
      );
  }
}

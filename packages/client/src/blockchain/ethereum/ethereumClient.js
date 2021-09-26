import { ethers } from "ethers";
import Blockchains from "@/../../knightlands-shared/blockchains.js";
import BlockchainClient from "./../blockchainClient";
import currency_type from "../../../../knightlands-shared/currency_type";

import { IncorrectNetworkError } from "../WalletErrors";

export default class EthereumClient extends BlockchainClient {
  constructor(network, artifacts) {
    super();

    this._artifacts = artifacts;
    this._network = network;
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
      this._network
    );
    provider.on("network", (newNetwork, oldNetwork) => {
      if (oldNetwork) {
        window.location.reload();
      }
    });

    try {
      await provider.getNetwork();
    } catch (e) {
      throw new IncorrectNetworkError(this._network);
    }

    this._provider = provider;
    await provider.send("eth_requestAccounts", []);

    this._address = await this._provider.getSigner().getAddress();

    this._paymentContract = new ethers.Contract(
      this._artifacts.PaymentGateway.address,
      this._artifacts.PaymentGateway.abi,
      provider
    );

    this._tokens = {
      [currency_type.Dkt]: new ethers.Contract(
        this._artifacts.Flesh.address,
        this._artifacts.Flesh.abi,
        provider
      )
    };

    this._tokenGateway = new ethers.Contract(
      this._artifacts.TokensDepositGateway.address,
      this._artifacts.TokensDepositGateway.abi,
      provider
    );

    this._presaleCardsGate = new ethers.Contract(
      this._artifacts.PresaleCardsGate.address,
      this._artifacts.PresaleCardsGate.abi,
      provider
    );

    this._presaleCards = new ethers.Contract(
      this._artifacts.PresaleCards.address,
      this._artifacts.PresaleCards.abi,
      provider
    );

    this._inited = true;
  }

  async purchaseIAP(iap, paymentId, price, nonce, deadline, signature) {
    console.log("price", price);
    return await this._paymentContract
      .connect(this._provider.getSigner())
      .purchase(iap, paymentId, price, nonce, deadline, signature, {
        value: ethers.BigNumber.from(price),
        gasLimit: 200000
      });
  }

  async finishDividendsWithdrawal(
    withdrawalId,
    amount,
    nonce,
    deadline,
    signature
  ) {
    await this._paymentContract
      .connect(this._provider.getSigner())
      .withdrawDivs(
        this.getAddress(),
        withdrawalId,
        amount,
        nonce,
        deadline,
        signature
      );
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

  async finishTokenWithdrawal(
    type,
    withdrawalId,
    amount,
    nonce,
    deadline,
    signature
  ) {
    await this._tokens[type]
      .connect(this._provider.getSigner())
      .mintWithSignature(
        this.getAddress(),
        amount,
        nonce,
        deadline,
        withdrawalId,
        signature
      );
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

  async isAllowedAllForPresale() {
    return this._presaleCards
      .connect(this._provider.getSigner())
      .isApprovedForAll(this.getAddress(), this._presaleCardsGate.address);
  }

  async allowAllForPresale() {
    const receipt = await this._presaleCards
      .connect(this._provider.getSigner())
      .setApprovalForAll(this._presaleCardsGate.address, true);

    await receipt.wait(2);
  }

  async depositPresalePacks(depositId, tokenIds) {
    await this._presaleCardsGate
      .connect(this._provider.getSigner())
      .deposit(depositId, tokenIds);
  }
}

import { ethers } from "ethers";
import Blockchains from "@/../../knightlands-shared/blockchains.js";
import BlockchainClient from "./../blockchainClient";

const PaymentGateway = require("./PaymentGateway.json");
const Flesh = require("./Flesh.json");

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
      "goerli"
    );
    provider.on("network", (newNetwork, oldNetwork) => {
      console.log("network change to", newNetwork);
      if (oldNetwork) {
        window.location.reload();
      }
    });

    this._provider = provider;
    await provider.send("eth_requestAccounts", []);
    console.log(await provider.getNetwork());

    this._address = await this._provider.getSigner().getAddress();

    this._paymentContract = new ethers.Contract(
      PaymentGateway.address,
      PaymentGateway.abi,
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
}

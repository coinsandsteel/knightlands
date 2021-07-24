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
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    provider.on("network", (newNetwork, oldNetwork) => {
      if (oldNetwork) {
        window.location.reload();
      }
    });

    this._provider = provider;
    await provider.send("eth_requestAccounts", []);

    this._address = await this._provider.getSigner().getAddress();

    this._paymentContract = new ethers.Contract(
      PaymentGateway.address,
      PaymentGateway.abi,
      provider
    );

    this._inited = true;
  }

  async purchaseIAP(iap, paymentId, price, nonce, timestamp, signature) {
    console.log(this._paymentContract);
    return await this._paymentContract
      .connect(this._provider.getSigner())
      .purchase(iap, paymentId, price, nonce, timestamp, signature, {
        value: ethers.BigNumber.from(price)
      });
  }
}

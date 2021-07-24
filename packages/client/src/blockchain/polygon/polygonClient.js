import web3 from "web3";

export default class PolygonClient {
  static isAddress(addr) {
    return web3.utils.isAddress(addr);
  }
}

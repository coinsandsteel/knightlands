import Blockchains from "@/../../knightlands-shared/blockchains";

import TronBlockchainClient from "./tron/tronBlockchainClient";
import PolygonClient from "./polygon/polygonClient";
import EthereumClient from "./ethereum/ethereumClient";

function BlockchainFactory(blockchain) {
  switch (blockchain) {
    case Blockchains.Tron:
      return new TronBlockchainClient();

    case Blockchains.Polygon:
      return new PolygonClient();

    case Blockchains.Ethereum:
      return new EthereumClient();
  }

  return null;
}

export default BlockchainFactory;

import Blockchains from "@/../../knightlands-shared/blockchains";

import TronBlockchainClient from "./tron/tronBlockchainClient";
import EthereumClient from "./ethereum/ethereumClient";

function BlockchainFactory(blockchain) {
  switch (blockchain) {
    case Blockchains.Tron:
      return new TronBlockchainClient();

    case Blockchains.Polygon:
      return new EthereumClient(
        {
          chainId: 0x89
        },
        {},
        {
          chainId: "0x89",
          chainName: "Polygon",
          nativeCurrency: {
            name: "MATIC",
            symbol: "MATIC",
            decimals: 18
          },
          rpcUrls: ["https://polygon-rpc.com"],
          blockExplorerUrls: ["https://polygonscan.com"]
        }
      );

    case Blockchains.Ethereum:
      if (process.env.NODE_ENV == "production") {
        return new EthereumClient({ chainId: "0x1" }, {});
      } else {
        const PaymentGateway = require("./artifacts/goerli/PaymentGateway.json");
        const Flesh = require("./artifacts/goerli/Flesh.json");
        const PresaleCardsGate = require("./artifacts/goerli/PresaleCardsGate.json");
        const PresaleCards = require("./artifacts/goerli/PresaleCardsTest.json");
        const TokensDepositGateway = require("./artifacts/goerli/TokensDepositGateway.json");

        return new EthereumClient(
          { chainId: 5 },
          {
            PaymentGateway,
            Flesh,
            PresaleCards,
            PresaleCardsGate,
            TokensDepositGateway
          }
        );
      }
  }

  return null;
}

export default BlockchainFactory;

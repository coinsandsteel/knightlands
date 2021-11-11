import Blockchains from "@/../../knightlands-shared/blockchains";

import TronBlockchainClient from "./tron/tronBlockchainClient";
import EthereumClient from "./ethereum/ethereumClient";

function BlockchainFactory(blockchain) {
  switch (blockchain) {
    case Blockchains.Tron:
      return new TronBlockchainClient();

    case Blockchains.Polygon: {
      const PaymentGateway = require("./artifacts/polygon/PaymentGateway.json");
      const PresaleCardsGate = require("./artifacts/polygon/PresaleCardsGate.json");
      const PresaleCards = require("./artifacts/polygon/PresaleCards.json");

      return new EthereumClient(
        { chainId: 137, id: Blockchains.Polygon },
        {
          PaymentGateway,
          PresaleCardsGate,
          PresaleCards
        },
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
    }

    case Blockchains.Ethereum:
      if (process.env.NODE_ENV == "production") {
        const PaymentGateway = require("./artifacts/ethereum/PaymentGateway.json");

        return new EthereumClient(
          { chainId: 1, id: Blockchains.Ethereum },
          {
            PaymentGateway
          }
        );
      } else {
        const PaymentGateway = require("./artifacts/goerli/PaymentGateway.json");
        const Flesh = require("./artifacts/goerli/Flesh.json");
        const PresaleCardsGate = require("./artifacts/goerli/PresaleCardsGate.json");
        const PresaleCards = require("./artifacts/goerli/PresaleCardsTest.json");
        const TokensDepositGateway = require("./artifacts/goerli/TokensDepositGateway.json");

        return new EthereumClient(
          { chainId: 5, id: Blockchains.Ethereum },
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

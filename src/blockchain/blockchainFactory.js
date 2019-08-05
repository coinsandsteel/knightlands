import Blockchains from "./../../knightlands-shared/blockchains.js";

import TronBlockchainClient from "./tron/tronBlockchainClient.js";

function BlockchainFactory(blockchain) {
    switch (blockchain) {
        case Blockchains.Tron:
            return new TronBlockchainClient();
    }

    return null;
};

export default BlockchainFactory;
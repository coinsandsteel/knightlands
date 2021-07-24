<script>
import Blockchains from "@/../../knightlands-shared/blockchains";
import { toDecimal } from "../../blockchain/utils";

import Polygon from "../../blockchain/polygon/polygonClient";

export default {
  methods: {
    isAddress(blockchainId, addr) {
      switch (blockchainId) {
        case Blockchains.Polygon:
        case Blockchains.Ethereum:
          return Polygon.isAddress(addr);
      }
    },
    toDecimal(blockchainId, value) {
      let decimals = 6;
      switch (blockchainId) {
        case Blockchains.Tron:
          decimals = 6;
          break;
      }

      return toDecimal(value, decimals);
    },
    getIcon(blockchainId) {
      switch (blockchainId) {
        case Blockchains.Tron:
          return "icon-trx";
      }

      return "";
    }
  }
};
</script>

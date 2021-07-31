<template>
  <div class="pointer" @click="add">
    <img class="svg-icon" src="../../assets/ui/metamask.svg" />
  </div>
</template>

<script>
import CurrencyType from "@/../../knightlands-shared/currency_type";
import NetworkRequestErrorMixin from "@/components/NetworkRequestErrorMixin.vue";

import ConnectWallet from "@/views/Account/ConnectWallet.vue";
import { create } from "vue-modal-dialogs";

const ShowWallet = create(ConnectWallet, "chain");

export default {
  props: ["chain", "type", "image"],
  mixins: [NetworkRequestErrorMixin],
  methods: {
    async add() {
      await ShowWallet();

      if (!this.$game.blockchain) {
        return;
      }

      const info = await this.performRequest(
        this.$game.blockchain.getTokenInfo(this.type)
      );

      this.performRequest(
        window.ethereum.request({
          method: "wallet_watchAsset",
          params: {
            type: "ERC20", // Initially only supports ERC20, but eventually more!
            options: {
              ...info,
              image: this.type == CurrencyType.Dkt ? "" : ""
            }
          }
        })
      );
    }
  }
};
</script>

<style lang="less" scoped>
.svg-icon {
  max-width: 3rem;
  max-height: 3rem;
}
</style>

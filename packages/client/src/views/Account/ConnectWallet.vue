<template>
  <div class="flex flex-center flex-column height-100 width-100 mask">
    <div class="screen-background"></div>
    <Title class="margin-bottom-5">
      {{ $t("ch-wal") }}
    </Title>
    <div class="flex flex-column flex-center">
      <CustomButton
        class="margin-bottom-1"
        minWidth="20rem"
        type="yellow"
        v-for="c in availableChains"
        :key="c"
        @click="connectWallet(c)"
      >
        <IconWithValue :iconClass="icon(c)">{{ $t(c) }}</IconWithValue>
      </CustomButton>
      <CustomButton
        minWidth="20rem"
        class="margin-top-1"
        @click="$close(false)"
        >{{ $t("btn-cancel") }}</CustomButton
      >
    </div>
  </div>
</template>

<script>
import CustomButton from "@/components/Button.vue";
import Title from "@/components/Title.vue";
import IconWithValue from "@/components/IconWithValue.vue";
import Blockchains from "@/../../knightlands-shared/blockchains";
import BlockchainFactory from "@/blockchain/blockchainFactory";
import WalletLockedError from "@/blockchain/WalletLockedError";
import UnlockWallet from "./UnlockWallet.vue";
import NetworkRequestErrorMixin from "@/components/NetworkRequestErrorMixin.vue";
import PromptMixin from "@/components/PromptMixin.vue";

import { create } from "vue-modal-dialogs";
const ShowUnlockWallet = create(UnlockWallet, "chain");

export default {
  mixins: [NetworkRequestErrorMixin, PromptMixin],
  components: { CustomButton, Title, IconWithValue },
  props: ["chain"],
  data: () => ({
    availableChains: [Blockchains.Tron]
  }),
  mounted() {
    if (this.chain) {
      this.connectWallet(this.chain);
    }
  },
  methods: {
    icon(chain) {
      switch (chain) {
        case Blockchains.Tron:
          return "icon-trx-dark";
      }

      return "";
    },
    async connectWallet(chain) {
      this.$game.blockchain = BlockchainFactory(chain);
      try {
        await this.performRequestNoCatch(this.$game.blockchain.init());
        this.$close(true);
      } catch (e) {
        if (e instanceof WalletLockedError) {
          await ShowUnlockWallet(chain);
          await this.connectWallet(chain);
        } else {
          this.showPrompt(this.$t("no-wa-title"), this.$t("no-wa-desc"), [
            {
              type: "green",
              title: this.$t("btn-ok"),
              response: true
            }
          ]);
        }
      }
    }
  }
};
</script>

<style scoped>
.mask {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 900;
  overflow: hidden auto;
}
</style>

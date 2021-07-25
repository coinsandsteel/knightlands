<template>
  <div class="screen-content">
    <div class="screen-background"></div>

    <div class="flex flex-column">
      <DividendsWithdrawalElement
        v-for="(w, idx) in withdrawals"
        :key="w._id"
        :withdrawal="w"
        :odd="idx % 2 == 0"
        @withdrawal="handleWithdrawal"
      />
    </div>
  </div>
</template>

<script>
import AppSection from "@/AppSection.vue";
import NetworkRequestErrorMixin from "@/components/NetworkRequestErrorMixin.vue";
import DividendsWithdrawalElement from "./DividendsWithdrawalElement.vue";

import ConnectWallet from "@/views/Account/ConnectWallet.vue";
import { create } from "vue-modal-dialogs";

const ShowWallet = create(ConnectWallet, "chain");

export default {
  mixins: [AppSection, NetworkRequestErrorMixin],
  components: { DividendsWithdrawalElement },
  created() {
    this.title = "w-divs-w";
    this.$options.useRouterBack = true;
  },
  data: () => ({
    withdrawals: []
  }),
  mounted() {
    this.fetchWithdrawals();
  },
  methods: {
    async fetchWithdrawals() {
      const info = await this.$game.getDivsStatus();
      this.withdrawals = info.pendingDivs;
    },
    async handleWithdrawal(withdrawal) {
      try {
        await ShowWallet(withdrawal.blockchainId);
        await this.performRequest(
          this.$game.blockchain.finishDividendsWithdrawal(
            withdrawal._id,
            withdrawal.amount,
            withdrawal.nonce,
            withdrawal.signature
          )
        );
      } finally {
        await this.fetchWithdrawals();
      }
    }
  }
};
</script>

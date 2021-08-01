<template>
  <div class="screen-content">
    <div class="screen-background"></div>

    <div v-bar>
      <div class="flex flex-column">
        <component
          v-for="(entry, idx) in history"
          :is="getType(entry.type)"
          :key="entry._id"
          :id="entry._id"
          :data="entry.data"
          :date="entry.date"
          :chain="entry.chain"
          :odd="idx % 2 == 0"
        ></component>
      </div>
    </div>
  </div>
</template>

<script>
import AppSection from "@/AppSection.vue";
import NetworkRequestErrorMixin from "@/components/NetworkRequestErrorMixin.vue";
import HistoryDivsWithdrawal from "./HistoryDivsWithdrawal.vue";
import HistoryTokenDeposit from "./HistoryTokenDeposit.vue";
import HistoryTokenWithdrawal from "./HistoryTokenWithdrawal.vue";

export default {
  mixins: [AppSection, NetworkRequestErrorMixin],
  components: {
    HistoryDivsWithdrawal,
    HistoryTokenDeposit,
    HistoryTokenWithdrawal
  },
  created() {
    this.title = "w-divs-w";
    this.$options.useRouterBack = true;
  },
  data: () => ({
    history: []
  }),
  activated() {
    this.fetchWithdrawals();
  },
  methods: {
    getType(type) {
      switch (type) {
        case "token-d":
          return "HistoryTokenDeposit";

        case "divs-w":
          return "HistoryDivsWithdrawal";

        case "token-w":
          return "HistoryTokenWithdrawal";
      }
    },
    async fetchWithdrawals() {
      this.history = await this.$game.fetchWithdrawTokensStatus();
    }
  }
};
</script>

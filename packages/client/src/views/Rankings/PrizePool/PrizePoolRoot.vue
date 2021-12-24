<template>
  <div class="screen-contente">
    <div class="screen-background"></div>
    <Tabs
      :tabs="tabs"
      :router="true"
      :currentTab="currentTab"
      @onClick="switchTab"
      :replace="true"
    ></Tabs>

    <keep-alive>
      <router-view :currentRank="currentRank"></router-view>
    </keep-alive>

    <portal to="footer" v-if="isActive && currentRank && !currentRank.claimed">
      <CustomButton @click="claimPrize" type="green">Claim reward</CustomButton>
    </portal>
  </div>
</template>

<script>
import AppSection from "@/AppSection.vue";
import Tabs from "@/components/Tabs.vue";
import CustomButton from "@/components/Button.vue";
import Blockchains from "@/../../knightlands-shared/blockchains";
import ConnectWallet from "@/views/Account/ConnectWallet.vue";
import { create } from "vue-modal-dialogs";
const ShowWallet = create(ConnectWallet, "chain");

const BreakdownTab = "breakdown";
const RanksTab = "prize-pool";
const Rewards = "pool-rewards";

export default {
  mixins: [AppSection],
  components: { Tabs, CustomButton },
  created() {
    this.title = "w-prize";
    this.$options.useRouterBack = true;
  },
  data: () => ({
    currentRank: null,
    tabs: [
      {
        title: RanksTab,
        value: RanksTab,
        to: { name: "prize-pool" }
      },
      { title: Rewards, value: Rewards, to: { name: "pool-rewards" } },
      { title: BreakdownTab, value: BreakdownTab, to: { name: "breakdown" } }
    ],
    currentTab: RanksTab
  }),
  async activated() {
    this.currentRank = await this.$game.getPrizePoolRank();
  },
  methods: {
    switchTab(newTab) {
      this.currentTab = newTab;
    },
    async claimPrize() {
      const { address } = await ShowWallet(Blockchains.Polygon);
      const txDetails = await this.$game.withdrawPrizePool(address);
      await this.$game.blockchain.withdrawUSDCPot(txDetails);
    }
  }
};
</script>

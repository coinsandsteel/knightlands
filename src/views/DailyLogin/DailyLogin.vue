<template>
  <UserDialog
    :compact="true"
    :title="$t('daily-login-title')"
    :hideCloseBtn="true"
    :disableScroll="true"
  >
    <template v-slot:content>
      <div class="flex flex-space-evenly">
        <span class="font-size-18 width-100 margin-bottom-3">{{$t('daily-login-desc')}}</span>

        <DailyReward
          v-for="(reward, index) in rewards"
          :key="index"
          :index="index"
          :current="step == index"
          :collected="index < (collected ? step-1: step)"
          :reward="reward"
          @hint="rewardHint"
        ></DailyReward>
      </div>
    </template>

    <template v-slot:footer>
      <PromisedButton :props="{type:'green'}" :promise="request" @click="collect">{{$t("claim-daily-bonus")}}</PromisedButton>
    </template>
  </UserDialog>
</template>

<script>
import UserDialog from "@/components/UserDialog.vue";
import DailyRewards from "@/daily_rewards";
import DailyReward from "./DailyReward.vue";
import PromisedButton from "@/components/PromisedButton.vue";
import HintHandler from "@/components/HintHandler.vue";

import ItemsReceived from "@/components/ItemsReceived.vue";
import { create } from "vue-modal-dialogs";
const ShowItems = create(ItemsReceived, ...ItemsReceived.props);

export default {
  mixins: [HintHandler],
  props: ["step", "collected"],
  components: { UserDialog, DailyReward, PromisedButton },
  data: () => ({
    rewards: DailyRewards,
    request: null
  }),
  methods: {
    rewardHint(reward) {
      this.handleHint({
        template: reward.itemId,
        quantity: reward.minCount
      });
    },
    async collect() {
      this.request = this.$game.collectDailyReward();
      let items = await this.request;
      if (!Array.isArray(items)) {
        items = [items];
      }
      await ShowItems(items);
      this.$close();
    }
  }
};
</script>
<template>
  <div class="flex flex-center height-100 flex-column flex-no-wrap padding-1 panel">
    <div class="flex flex-space-evenly full-flex">
      <span class="font-size-18 width-100 margin-bottom-3">{{$t('daily-login-desc')}}</span>
      <div class="width-100" v-bar>
        <div>
          <div class="flex width-100 flex-space-evenly">
          <DailyReward
            v-for="(reward, index) in rewards"
            :key="index"
            :index="index"
            :current="step == index"
            :collected="isCollected(index)"
            :reward="reward"
            @hint="rewardHint"
          ></DailyReward>
        </div>
        </div>
      </div>
    </div>

    <div class="margin-top-3 flex flex-center width-100">
      <PromisedButton
        :props="{type:'green'}"
        :promise="request"
        @click="collect"
        v-if="!collected"
      >{{$t("claim-daily-bonus")}}</PromisedButton>
      <span class="font-size-18" v-else>{{$t("time-till-reward", {time: timer.value})}}</span>
    </div>
  </div>
</template>

<script>
import UserDialog from "@/components/UserDialog.vue";
import DailyRewards from "@/daily_rewards";
import DailyReward from "./DailyReward.vue";
import PromisedButton from "@/components/PromisedButton.vue";
import HintHandler from "@/components/HintHandler.vue";
import Timer from "@/timer";

import ItemsReceived from "@/components/ItemsReceived.vue";
import { create } from "vue-modal-dialogs";
const ShowItems = create(ItemsReceived, ...ItemsReceived.props);

export default {
  mixins: [HintHandler],
  components: { UserDialog, DailyReward, PromisedButton },
  data: () => ({
    rewards: DailyRewards.rewards,
    request: null,
    step: 0,
    collected: false,
    timer: new Timer(true)
  }),
  async activated() {
    const dailyRewardStatus = await this.$game.fetchDailyRewardStatus();
    this.step = dailyRewardStatus.step;
    this.collected = !dailyRewardStatus.readyToCollect;
    this.timer.timeLeft = dailyRewardStatus.untilNext / 1000;
  },
  methods: {
    isCollected(index) {
      return index < (!this.collected ? this.step-1: this.step);
    },
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
      this.collected = true;
    }
  }
};
</script>
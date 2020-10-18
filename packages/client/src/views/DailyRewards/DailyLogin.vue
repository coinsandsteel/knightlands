<template>
  <div
    class="dummy-height flex flex-center flex-column flex-no-wrap"
  >
    <div class="dummy-height flex flex-column flex-no-wrap full-flex width-100">
      <span class="font-size-20 color-panel-1 font-weight-900">{{
        $t("daily-login-desc")
      }}</span>
      <div class="full-flex dummy-height margin-top-2">
        <div class="width-100" v-bar>
          <div class="dummy-height height-100">
            <div class="width-100 login-rewards">
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
    </div>

    <div class="dummy-height margin-top-2 flex flex-center width-100">
      <PromisedButton
        type="green"
        :promise="request"
        @click="collect"
        v-if="!collected"
        >{{ $t("claim-daily-bonus") }}</PromisedButton
      >
      <div class="color-panel-1" v-else>
        <span class="font-size-18" >{{
        $t("time-till-reward", { time: timer.value })
      }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import DailyRewards from "@/daily_rewards";
import DailyReward from "./DailyReward.vue";
import PromisedButton from "@/components/PromisedButton.vue";
import HintHandler from "@/components/HintHandler.vue";
import Timer from "@/timer";

import ItemsReceived from "@/components/ItemsReceived.vue";
import { create } from "vue-modal-dialogs";
const ShowItems = create(ItemsReceived, "items", "soft", "hard", "exp", "dkt");

export default {
  mixins: [HintHandler],
  components: { DailyReward, PromisedButton },
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
      return index <= this.step - 1;
    },
    rewardHint(reward) {
      this.handleHint({
        template: reward.itemId,
        count: reward.minCount
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
      this.step++;
    }
  }
};
</script>

<style scoped>
.login-rewards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(6.5rem, 1fr));
  justify-items: center;
}
</style>

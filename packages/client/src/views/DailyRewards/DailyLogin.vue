<template>
  <div class="dummy-height flex flex-center flex-column flex-no-wrap">
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
        @click="collect"
        v-if="!collected"
        id="collect"
        >{{ $t("claim-daily-bonus") }}</PromisedButton
      >
      <div class="color-panel-1" v-else>
        <span class="font-size-18">{{
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
import NetworkRequestErrorMixin from "@/components/NetworkRequestErrorMixin.vue";
import { mapState } from "vuex";
import Timer from "@/timer";
import ItemsReceived from "@/components/ItemsReceived.vue";
import { create } from "vue-modal-dialogs";
const ShowItems = create(ItemsReceived, "items", "soft", "hard", "exp", "dkt");

export default {
  mixins: [HintHandler, NetworkRequestErrorMixin],
  components: { DailyReward, PromisedButton },
  data: () => ({
    rewards: DailyRewards.rewards,
    timer: new Timer(true)
  }),
  computed: {
    ...mapState({
      step: state => state.dailyLogin.step,
      timeLeft: state => state.dailyLogin.timeLeft,
      collected: state => !state.dailyLogin.readyToCollect
    })
  },
  watch: {
    timeLeft: {
      immediate: true,
      handler() {
        this.timer.timeLeft = this.timeLeft;
      }
    }
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
      let items = await this.performRequest(this.$game.collectDailyReward());
      if (!Array.isArray(items)) {
        items = [items];
      }
      await this.$game.notifications.updateDailyLogin();
      await ShowItems(items);
    }
  }
};
</script>

<style scoped>
.login-rewards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(8rem, 1fr));
  justify-items: center;
  row-gap: 0.5rem;
  column-gap: 0.5rem;
}
</style>

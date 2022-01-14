<template>
  <div class="flex flex-center flex-column padding-top-2">
    <div class="flex flex-center flex-space-evenly width-90">
      <span class="font-size-18 width-100 margin-bottom-3">{{$t('daily-refills-desc')}}</span>

      <DailyRefill
        v-for="refill in refills"
        :key="refill.type"
        :refill="refill"
        :collected="collected"
      ></DailyRefill>
    </div>

    <div class="margin-top-3 flex flex-center width-100">
      <PromisedButton
        type="green"
        :promise="request"
        @click="collect"
        v-if="!collected"
      >{{$t("claim-daily-refill")}}</PromisedButton>
      <div class="color-panel-1" v-else>
        <span class="font-size-18">{{$t("time-till-refill", {time: timer.value})}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import PromisedButton from "@/components/PromisedButton.vue";
import DailyRewards from "@/daily_rewards";
import DailyRefill from "./DailyRefill.vue";
import Timer from "@/timer";

export default {
  components: { PromisedButton, DailyRefill },
  data: () => ({
    request: null,
    collected: false,
    refills: [],
    timer: new Timer(true)
  }),
  async activated() {
    this.refills.length = 0;

    const rank = this.$game.rank();

    DailyRewards.refills.forEach(refill => {
      let quantity = 0;
      for (let i = 0; i < refill.refillsMeta.length; ++i) {
        const refillMeta = refill.refillsMeta[i];
        if (refillMeta.rank <= rank) {
          quantity = refillMeta.quantity;
        }
      }

      this.refills.push({
        type: refill.type,
        quantity
      });
    });

    this.request = this.$game.fetchDailyRefillsStatus();
    const status = await this.request;
    this.collected = !status.readyToCollect;
    this.timer.timeLeft = status.untilNext / 1000;
  },
  methods: {
    async collect() {
      this.request = this.$game.collectDailyRefills();
      await this.request;
      this.collected = true;
    }
  }
};
</script>

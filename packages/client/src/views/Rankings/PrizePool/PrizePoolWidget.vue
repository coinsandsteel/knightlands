<template>
  <div class="flex flex-column flex-center relative pp-w width-100">
    <img src="../../../assets/ui/bg_topbanner.png" class="w-bg" />

    <div
      class="left flex flex-column flex-center font-weight-900 font-outline"
      v-resize-text="{
        ratio: 1.3,
        minFontSize: '14px',
        maxFontSize: '100px',
        delay: 200
      }"
    >
      <span class="gr-title uppercase">{{ $t("grand-royal") }}</span>

      <IconWithValue
        class="margin-top-1"
        iconClass="icon-usdc medium"
        valueClass=""
        >{{ $t("grand-prize", { n: 30000 }) }}</IconWithValue
      >
    </div>

    <div class="right flex flex-column flex-center">
      <div class="timer flex flex-items-center flex-no-wrap width-100">
        <span class="icon-timer yellow small" v-if="timer.timeLeft > 0"></span>
        <div
          class="full-flex"
          v-resize-text="{
            ratio: 1.1,
            minFontSize: '8px',
            maxFontSize: '100px',
            delay: 200
          }"
        >
          <span class="font-outline nowrap" v-if="timer.timeLeft > 0">{{
            $t("d-s-f-at", { timer: timeLeft })
          }}</span>
          <span class="font-outline nowrap" v-else>{{ $t("d-s-f") }}</span>
        </div>
      </div>

      <CustomButton class="margin-top-1" type="yellow" @click="goToPrizePool">{{
        $t("pp-track")
      }}</CustomButton>
    </div>
  </div>
</template>

<script>
import IconWithValue from "@/components/IconWithValue.vue";
import CustomButton from "@/components/Button.vue";
import Timer from "@/timer";

export default {
  components: { IconWithValue, CustomButton },
  data: () => ({
    timer: new Timer(true)
  }),
  async mounted() {
    const status = await this.$game.getSeasonStatus();
    this.timer.timeLeft = status.finishAt - this.$game.nowSec;
  },
  methods: {
    goToPrizePool() {
      this.$router.push({ name: "prize-pool" });
    }
  },
  computed: {
    timeLeft() {
      let timeLeft = this.timer.timeLeft;
      let minutes = Math.floor(timeLeft / 60);

      let hours = Math.floor(minutes / 60);
      minutes -= hours * 60;

      let days = Math.floor(hours / 24);
      hours -= days * 24;

      let seconds = Math.floor(timeLeft % 60);

      return `${days}${this.$t("day")} ${hours}${this.$t(
        "hour"
      )} ${minutes}${this.$t("minute")} ${seconds}${this.$t("second")}`;
    }
  }
};
</script>

<style lang="less" scoped>
.pp-w {
  padding: 1rem;
  display: grid;
  align-items: stretch;
  grid-template-columns: 2% 58% 35% 5%;
  grid-template-rows: 1fr;

  & .w-bg {
    max-width: 100%;
    grid-row: 1;
    grid-column: ~"1/5";
  }

  & .left {
    grid-row: 1;
    grid-column: 2;
  }

  & .right {
    grid-row: 1;
    grid-column: 3;
  }
}

.timer {
  border-image: url("../../../assets/ui/timer_bg.png");
  border-image-slice: 22 fill;
  border-image-width: 22px;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
}

.gr-title {
  color: #ffd347;
}
</style>

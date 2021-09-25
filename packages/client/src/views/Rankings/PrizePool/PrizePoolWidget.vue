<template>
  <div class="flex flex-column flex-center relative pp-w width-100">
    <div class="w-bg absolute-stretch"></div>

    <HintButton :texts="['t-d-43']" title="grand-royale"
      ><h1 class="font-outline">{{ $t("grand-royal") }}</h1></HintButton
    >

    <IconWithValue
      iconClass="icon-usdc huge"
      valueClass="font-size-4 font-weight-900 font-outline"
      >{{ $t("grand-prize", { n: 30000 }) }}</IconWithValue
    >

    <span class="font-size-20 font-outline">{{
      $t("d-s-f-at", { timer: timeLeft })
    }}</span>

    <CustomButton class="margin-top-2" type="yellow" @click="goToPrizePool">{{
      $t("pp-track")
    }}</CustomButton>
  </div>
</template>

<script>
import HintButton from "@/components/HintButton.vue";
import IconWithValue from "@/components/IconWithValue.vue";
import CustomButton from "@/components/Button.vue";
import Timer from "@/timer";

export default {
  components: { IconWithValue, CustomButton, HintButton },
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

  & .w-bg {
    z-index: -1;
    background-image: url("../../../assets/shop/shop_packs_pattern4.jpg");
    background-repeat: repeat-x;
    background-size: 8% 100%;
  }
}
</style>

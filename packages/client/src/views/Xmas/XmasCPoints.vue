<template>
  <div class="screen-content font-size-25">
    <div class="screen-background"></div>

    <div class="color-panel-1 margin-bottom-4">
      <IconWithValue :flip="true" iconClass="icon-dkt" class="margin-right-1">{{
        emission
      }}</IconWithValue>

      <span class="font-size-22">{{
        $t("time-till-rp", { time: nextPayout.value })
      }}</span>
    </div>

    <div class="score-stats">
      <div class="row">
        <span>
          {{ $t("rp-d-b") }}
        </span>
        <IconWithValue iconClass="icon-dkt">{{ dkt }}</IconWithValue>
      </div>

      <div class="row">
        <span>
          {{ $t("ex-dkt") }}
        </span>
        <IconWithValue iconClass="icon-dkt">{{ expectedDkt }}</IconWithValue>
      </div>

      <div class="row">
        <span>
          {{ $t("rp-score") }}
        </span>
        <IconWithValue iconClass="icon-rp">{{ score }}</IconWithValue>
      </div>

      <div class="row">
        <span>
          {{ $t("rp-s-total") }}
        </span>
        <IconWithValue iconClass="icon-rp">{{ totalPointsUI }}</IconWithValue>
      </div>
    </div>

    <div
      class="color-panel-1 margin-top-4 flex flex-column padding-left-1 padding-right-1"
    >
      <span
        >At the end of the day, you will get FLESH based on your CP score.</span
      >
    </div>
  </div>
</template>

<script>
import CurrencyType from "@/../../knightlands-shared/currency_type";
import AppSection from "@/AppSection.vue";
import Timer from "@/timer";
import IconWithValue from "@/components/IconWithValue.vue";
import PromptMixin from "@/components/PromptMixin.vue";
import NetworkRequestErrorMixin from "@/components/NetworkRequestErrorMixin.vue";
import { mapState } from "vuex";

const PAYOUT_PERIOD = 86400;
const FLESH_EMISSION = 250;
const PRECISION = 10000;
const FLESH_PRECISION = 1000000;

export default {
  mixins: [AppSection, PromptMixin, NetworkRequestErrorMixin],
  components: { IconWithValue },
  created() {
    this.title = "Christmas Points";
  },
  data: () => ({
    nextPayout: new Timer(true),
    totalShares: 0,
    totalPoints: 0
  }),
  mounted() {
    this.init();
  },
  destroyed() {
    if (this.channel) {
      this.channel.destroy();
      this.channel = null;
    }
  },
  computed: {
    ...mapState({
      cpoints: state => state.xmas.cpoints
    }),
    dkt() {
      return this.$game.inventory.getCurrency(CurrencyType.Dkt, 6);
    },
    emission() {
      return FLESH_EMISSION;
    },
    score() {
      return Math.floor(this.cpoints.score * PRECISION) / PRECISION;
    },
    totalPointsUI() {
      return Math.floor(this.totalPoints * PRECISION) / PRECISION;
    },
    expectedDkt() {
      if (this.totalShares == 0) {
        return 0;
      }
      return (
        Math.floor(
          (this.cpoints.shares / this.totalShares) *
            this.emission *
            FLESH_PRECISION
        ) / FLESH_PRECISION
      );
    },
    shares() {
      return Math.floor(this.cpoints.shares * PRECISION) / PRECISION;
    }
  },
  methods: {
    async init() {
      this.channel = this.$game.createChannel("total_cp", false);
      this.channel.watch(this.updateShares.bind(this));

      const nextPayout = this.cpoints.lastClaimed + PAYOUT_PERIOD;
      this.nextPayout.timeLeft = nextPayout - this.$game.nowSec;

      const info = await this.performRequest(
        this.$store.dispatch("xmas/cpStatus")
      );
      console.log(info);
      this.updateShares(info);
    },
    updateShares(data) {
      this.totalShares = data.totalShares;
      this.totalPoints = data.totalPoints;
    }
  }
};
</script>

<style lang="less" scoped>
.score-stats {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr;
  padding-left: 1rem;
  padding-right: 1rem;

  & .row {
    display: grid;
    grid-template-columns: 1fr 4rem 1fr;
    grid-template-rows: 1fr;
    margin-bottom: 1rem;

    & :nth-child(1) {
      grid-column: 1;
      text-align: right;
    }

    & :nth-child(2) {
      grid-column: 3;
    }
  }
}
</style>

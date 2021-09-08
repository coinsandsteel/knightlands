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

    <div class="color-panel-2">
      <span v-if="isFreeAccount">{{ $t("acc-free") }}</span>
      <span v-else>{{ $t("acc-norm") }}</span>
    </div>

    <div class="flex flex-center margin-top-2" v-if="isFreeAccount">
      <CustomButton @click="upgradeAccount">{{
        $t("cnrt-normal")
      }}</CustomButton>
    </div>
    <div class="flex flex-center margin-top-2" v-else>
      <CustomButton @click="upgradeAccount">{{ $t("cnrt-free") }}</CustomButton>
    </div>

    <div
      class="color-panel-1 margin-top-4 flex flex-column padding-left-1 padding-right-1"
    >
      <span>{{ $t("rp-desc") }}</span>
    </div>
  </div>
</template>

<script>
import CurrencyType from "@/../../knightlands-shared/currency_type";
import AppSection from "@/AppSection.vue";
import Timer from "@/timer";
import IconWithValue from "@/components/IconWithValue.vue";
import CustomButton from "@/components/Button.vue";
import PromptMixin from "@/components/PromptMixin.vue";
import NetworkRequestErrorMixin from "@/components/NetworkRequestErrorMixin.vue";

const PAYOUT_PERIOD = 86400;
const FLESH_EMISSION = 1000;
const FREE_FLESH_EMISSION = 35;
const PRECISION = 10000;
const FLASH_PRECISION = 1000000;

export default {
  mixins: [AppSection, PromptMixin, NetworkRequestErrorMixin],
  components: { IconWithValue, CustomButton },
  created() {
    this.title = "w-rp";
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
    isFreeAccount() {
      return this.$game.isFreeAccount;
    },
    dkt() {
      return this.$game.inventory.getCurrency(CurrencyType.Dkt, 6);
    },
    emission() {
      return this.$game.isFreeAccount ? FREE_FLESH_EMISSION : FLESH_EMISSION;
    },
    score() {
      return Math.floor(this.$game.raidPoints.score * PRECISION) / PRECISION;
    },
    totalSharesUI() {
      return Math.floor(this.totalShares * PRECISION) / PRECISION;
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
          (this.$game.raidPoints.shares / this.totalShares) *
            this.emission *
            FLASH_PRECISION
        ) / FLASH_PRECISION
      );
    },
    shares() {
      return Math.floor(this.$game.raidPoints.shares * PRECISION) / PRECISION;
    }
  },
  methods: {
    async init() {
      this.channel = this.$game.createChannel("total_rp", false);
      this.channel.watch(this.updateShares.bind(this));

      const nextPayout = this.$game.raidPoints.lastClaimed + PAYOUT_PERIOD;
      this.nextPayout.timeLeft = nextPayout - this.$game.nowSec;

      const info = await this.performRequest(this.$game.fetchRaidPointsInfo());
      this.updateShares(info, this.isFreeAccount);
    },
    updateShares(data, isFree) {
      if (isFree) {
        this.totalShares = data.totalFreeShares;
        this.totalPoints = data.totalFreePoints;
      } else {
        this.totalShares = data.totalShares;
        this.totalPoints = data.totalPoints;
      }
    },
    async upgradeAccount() {
      const free = this.isFreeAccount;
      const response = await this.showPrompt(
        this.$t("acc-u-t"),
        free ? this.$t("acc-u-d") : this.$t("acc-u-d2"),
        [
          {
            type: "grey",
            title: this.$t("co-acc-u"),
            response: true
          },
          {
            type: "red",
            title: this.$t("c-acc-u"),
            response: false
          }
        ]
      );
      if (response === true) {
        await this.performRequest(this.$game.upgradeAccount());
        const info = await this.performRequest(
          this.$game.fetchRaidPointsInfo()
        );
        this.updateShares(info, !free);
      }
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

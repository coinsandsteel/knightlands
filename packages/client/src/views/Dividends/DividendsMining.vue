<template>
  <div
    class="flex flex-space-between flex-no-wrap flex-items-end color-panel-2 padding-left-2 padding-right-2"
  >
    <div class="flex flex-column">
      <span class="font-size-20 font-outline font-weight-900">{{
        $t("mine-rate", { rate: rate, lvl: rateLvl })
      }}</span>
      <CustomButton
        type="grey"
        class="margin-top-1"
        @click="$emit('upgradeMining')"
        :disabled="cantUpgradeRate"
      >
        {{ $t("btn-upgrade") }}
        <IconWithValue iconClass="icon-dkt">{{ ratePrice }}</IconWithValue>
      </CustomButton>
    </div>

    <CustomButton
      type="yellow"
      @click="$emit('collect')"
      :disabled="mined <= 0"
    >
      {{ $t("btn-collect") }}
      <IconWithValue iconClass="icon-dkt">{{ mined }}</IconWithValue>
    </CustomButton>
  </div>
</template>

<script>
import DividendsMeta from "@/dividends";
import IconWithValue from "@/components/IconWithValue.vue";
import CustomButton from "@/components/Button.vue";

export default {
  components: { IconWithValue, CustomButton },
  data: () => ({
    mined: 0
  }),
  mounted() {
    this.interval = setInterval(this.updateMinedAmount.bind(this), 1000);
    this.updateMinedAmount();
  },
  destroyed() {
    clearInterval(this.interval);
  },
  computed: {
    rate() {
      return (
        Math.floor(
          (Math.pow(
            DividendsMeta.mining.rate.base * this.$game.dividends.miningLevel,
            DividendsMeta.mining.rate.factor
          ) /
            24) *
            10000
        ) / 10000
      );
    },
    rateLvl() {
      return this.$game.dividends.miningLevel;
    },
    ratePrice() {
      return (
        Math.floor(
          Math.pow(
            DividendsMeta.mining.price.base *
              (this.$game.dividends.miningLevel + 1),
            DividendsMeta.mining.price.factor
          ) * 10000
        ) / 10000
      );
    },
    cantUpgradeRate() {
      return this.ratePrice > this.$game.dividends.unlockedTokens;
    }
  },
  methods: {
    updateMinedAmount() {
      const timePassed =
        this.$game.nowSec - this.$game.dividends.lastMiningUpdate;
      this.mined =
        Math.floor(((timePassed * this.rate) / 3600) * 10000) / 10000;
    }
  }
};
</script>

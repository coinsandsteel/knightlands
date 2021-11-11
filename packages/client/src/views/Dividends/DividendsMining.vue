<template>
  <div
    class="flex flex-space-between flex-no-wrap flex-column color-panel-2 padding-left-2 padding-right-2"
  >
    <div
      class="flex flex-items-center flex-space-between font-size-20 padding-right-1"
    >
      <div class="flex flex-center">
        <span class=" font-outline font-weight-900">{{
          $t("mine-rate", { rate: rate, lvl: rateLvl })
        }}</span>
        <span class="icon-rp big"></span>

        <span class="nav-arrow margin-left-1 margin-right-1"></span>

        <span class="font-size-20 font-outline font-weight-900 rarity-rare">{{
          $t("mine-rate-n", { rate: nextRate })
        }}</span>
        <span class="icon-rp big"></span>
      </div>

      <span class="rarity-mythical">{{ $t("rp-max") }}</span>
    </div>

    <div class="flex flex-space-between width-100 margin-top-1">
      <CustomButton
        type="grey"
        @click="$emit('upgradeMining')"
        :disabled="cantUpgradeRate"
      >
        {{ $t("btn-upgrade") }}
        <AshTag :price="ratePrice" v-model="price"></AshTag>
      </CustomButton>

      <CustomButton
        type="yellow"
        @click="$emit('collect')"
        :disabled="mined <= 0"
      >
        {{ $t("btn-collect") }}
        <IconWithValue iconClass="icon-rp big">{{ mined }}</IconWithValue>
      </CustomButton>
    </div>
  </div>
</template>

<script>
import DividendsMeta from "@/dividends";
import IconWithValue from "@/components/IconWithValue.vue";
import CustomButton from "@/components/Button.vue";
import AshTag from "@/components/AshTag.vue";

export default {
  components: { IconWithValue, CustomButton, AshTag },
  data: () => ({
    mined: 0,
    price: 0
  }),
  mounted() {
    this.interval = setInterval(this.updateMinedAmount.bind(this), 1000);
    this.updateMinedAmount();
  },
  destroyed() {
    clearInterval(this.interval);
  },
  computed: {
    nextRate() {
      return (
        Math.floor(
          (Math.pow(
            DividendsMeta.mining.rate.base *
              (this.$game.dividends.miningLevel + 1),
            DividendsMeta.mining.rate.factor
          ) /
            24) *
            this.$game.dktBonus *
            10000
        ) / 10000
      );
    },
    rate() {
      return (
        Math.floor(
          (Math.pow(
            DividendsMeta.mining.rate.base * this.$game.dividends.miningLevel,
            DividendsMeta.mining.rate.factor
          ) /
            24) *
            this.$game.dktBonus *
            10000
        ) / 10000
      );
    },
    rateLvl() {
      return this.$game.dividends.miningLevel;
    },
    ratePrice() {
      return (
        Math.pow(
          DividendsMeta.mining.price.base *
            (this.$game.dividends.miningLevel + 1),
          DividendsMeta.mining.price.factor
        ) * 100
      );
    },
    cantUpgradeRate() {
      return this.price > this.$game.dkt;
    }
  },
  methods: {
    updateMinedAmount() {
      const timePassed =
        this.$game.nowSec - this.$game.dividends.lastMiningUpdate;

      const week = 86400 * 7;
      const timePassedLimited = timePassed > week ? week : timePassed;

      this.mined =
        Math.floor(((timePassedLimited * this.rate) / 3600) * 10000) / 10000;
    }
  }
};
</script>

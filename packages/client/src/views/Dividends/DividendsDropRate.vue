<template>
  <div
    class="flex flex-space-between flex-no-wrap flex-items-center color-panel-1 padding-left-2 padding-right-2 font-size-20"
  >
    <div class="flex flex-column">
      <!-- <span class="font-size-20 font-outline font-weight-900">{{
        $t("d-drop-rate")
      }}</span> -->

      <span v-if="isMax">{{ rate }}%</span>
      <div class="flex flex-center" v-else>
        <span>+{{ currentRate }}%</span>
        <span class="icon-rp big"></span>
        <span class="nav-arrow margin-half"></span>
        <span class="rarity-rare">+{{ rate }}%</span>
        <span class="icon-rp big"></span>
      </div>
    </div>

    <CustomButton
      type="grey"
      class="margin-top-1"
      @click="$emit('upgrade')"
      :disabled="cantUpgradeRate"
    >
      {{ $t("btn-upgrade") }}
      <IconWithValue iconClass="icon-dkt2">{{ ratePrice }}</IconWithValue>
    </CustomButton>
  </div>
</template>

<script>
import DividendsMeta from "@/dividends";
import CustomButton from "@/components/Button.vue";
import IconWithValue from "@/components/IconWithValue.vue";

export default {
  components: { CustomButton, IconWithValue },
  computed: {
    isMax() {
      return this.level == DividendsMeta.dropRate.length;
    },
    level() {
      return this.$game.dividends.dropRateLevel;
    },
    meta() {
      return DividendsMeta.dropRate[this.level];
    },
    currentRate() {
      if (this.level > 0) {
        return DividendsMeta.dropRate[this.level - 1].rate;
      }

      return 0;
    },
    rate() {
      return this.meta.rate;
    },
    ratePrice() {
      return this.meta.price;
    },
    cantUpgradeRate() {
      return this.ratePrice > this.$game.dkt2;
    }
  }
};
</script>

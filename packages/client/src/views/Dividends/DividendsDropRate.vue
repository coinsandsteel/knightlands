<template>
  <div
    class="flex flex-space-between flex-no-wrap flex-items-center color-panel-1 padding-left-2 padding-right-2 font-size-20"
  >
    <div class="flex flex-column">
      <!-- <span class="font-size-20 font-outline font-weight-900">{{
        $t("d-drop-rate")
      }}</span> -->

      <div class="flex flex-center" v-if="isMax">
        <span>+{{ currentRate }}%</span>
        <span class="icon-rp big"></span>
      </div>
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
      v-if="!isMax"
      :disabled="cantUpgradeRate"
    >
      {{ $t("btn-upgrade") }}
      <AshTag :price="ratePrice" v-model="price" ref="tag"></AshTag>
    </CustomButton>
  </div>
</template>

<script>
import DividendsMeta from "@/metadata/dividends";
import CustomButton from "@/components/Button.vue";
import AshTag from "@/components/AshTag.vue";

export default {
  components: { CustomButton, AshTag },
  data: () => ({
    price: 0
  }),
  computed: {
    isMax() {
      return this.level == DividendsMeta.dropRate.length;
    },
    level() {
      return this.$game.dividends.dropRateLevel;
    },
    meta() {
      if (this.isMax) {
        return DividendsMeta.dropRate[DividendsMeta.dropRate.length - 1];
      }
      return DividendsMeta.dropRate[this.level];
    },
    currentRate() {
      if (this.level > 0) {
        return (
          Math.floor(DividendsMeta.dropRate[this.level - 1].rate * 10000) / 100
        );
      }

      return 0;
    },
    rate() {
      return Math.floor(this.meta.rate * 10000) / 100;
    },
    ratePrice() {
      return this.meta.price * 100;
    },
    cantUpgradeRate() {
      return this.price > this.$game.dkt;
    }
  }
};
</script>

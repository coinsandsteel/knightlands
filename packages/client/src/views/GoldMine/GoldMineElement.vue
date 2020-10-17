<template>
  <div
    class="flex flex-items-start padding-left-2 padding-right-2"
    :class="panelClass"
  >
    <div class="flex flex-column">
      <span class="font-size-20 font-outline font-weight-900">{{
        $t("mine-rate", { rate: rate, lvl: rateLvl })
      }}</span>
      <CustomButton
        type="grey"
        class="margin-top-1"
        @click="$emit('upgrade-rate', idx)"
        :disabled="cantUpgradeRate"
      >
        {{ $t("btn-upgrade") }}
        <IconWithValue iconClass="icon-gold">{{ ratePrice }}</IconWithValue>
      </CustomButton>
    </div>
  </div>
</template>

<script>
import CustomButton from "@/components/Button.vue";
import MinesMeta from "@/mines_meta";
import IconWithValue from "@/components/IconWithValue.vue";

export default {
  props: ["mine", "idx"],
  components: { CustomButton, IconWithValue },
  computed: {
    cantUpgradeRate() {
      return this.ratePrice > this.$game.softCurrency;
    },
    panelClass() {
      return this.idx % 2 ? "color-panel-1" : "color-panel-5";
    },
    rateLvl() {
      return this.mine.level + 1;
    },
    ratePrice() {
      return MinesMeta.mines[this.mine.level].price;
    },
    rate() {
      // per second
      return Math.floor(MinesMeta.mines[this.mine.level].rate * 3600);
    }
  }
};
</script>

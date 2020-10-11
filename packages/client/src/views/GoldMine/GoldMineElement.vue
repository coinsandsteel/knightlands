<template>
  <div class="flex flex-column" :class="panelClass">
    <ProgressBar :value="gold" :maxValue="maxStorage" class="margin-bottom-2" />
    <div class="flex flex-column flex-center">
      <div class="flex flex-column margin-bottom-1">
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

      <div class="flex flex-column margin-bottom-1 margin-top-2">
        <span class="font-size-20 font-outline font-weight-900">{{
          $t("mine-strg", { size: maxStorage, lvl: storageLvl })
        }}</span>
        <CustomButton
          type="grey"
          class="margin-top-1"
          @click="$emit('upgrade-storage', idx)"
          :disabled="cantUpgradeStorage"
        >
          {{ $t("btn-upgrade") }}
          <IconWithValue iconClass="icon-gold">{{
            storagePrice
          }}</IconWithValue>
        </CustomButton>
      </div>

      <CustomButton
        type="yellow"
        class="margin-top-1"
        @click="$emit('collect', idx)"
        :disabled="gold < 1"
      >
        {{ $t("btn-collect") }}
      </CustomButton>
    </div>
  </div>
</template>

<script>
import CustomButton from "@/components/Button.vue";
import ProgressBar from "@/components/ProgressBar.vue";
import MinesMeta from "@/mines_meta";
import IconWithValue from "@/components/IconWithValue.vue";

export default {
  props: ["mine", "idx"],
  components: { CustomButton, ProgressBar, IconWithValue },
  data: () => ({
    gold: 0
  }),
  mounted() {
    this.interval = setInterval(this.updateGold.bind(this), 1000);
    this.updateGold();
  },
  watch: {
    mine: {
      deep: true,
      handler() {
        this.updateGold();
      }
    }
  },
  destroyed() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  },
  computed: {
    cantUpgradeRate() {
      return this.ratePrice > this.$game.softCurrency;
    },
    cantUpgradeStorage() {
      return this.storagePrice > this.$game.softCurrency;
    },
    panelClass() {
      return this.idx % 2 ? "color-panel-1" : "color-panel-5";
    },
    rateLvl() {
      return this.mine.level + 1;
    },
    storageLvl() {
      return this.mine.storageLevel + 1;
    },
    maxStorage() {
      return MinesMeta.storage[this.mine.storageLevel].size;
    },
    storagePrice() {
      return MinesMeta.storage[this.mine.storageLevel].price;
    },
    ratePrice() {
      return MinesMeta.mines[this.mine.level].price;
    },
    rate() {
      // per second
      return Math.floor(MinesMeta.mines[this.mine.level].rate * 3600);
    }
  },
  methods: {
    updateGold() {
      const timePassed = this.$game.nowSec - this.mine.lastUpdate;
      let goldMined = timePassed * MinesMeta.mines[this.mine.level].rate;

      if (goldMined > this.maxStorage) {
        goldMined = this.maxStorage;
      }

      this.gold = Math.floor(this.mine.gold + goldMined);
    }
  }
};
</script>

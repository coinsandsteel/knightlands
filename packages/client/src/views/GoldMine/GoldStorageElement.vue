<template>
  <div
    class="flex flex-space-between flex-items-end color-panel-2 padding-left-2 padding-right-2"
  >
    <ProgressBar
      :maxValue="maxStorage"
      v-model="gold"
      class="margin-bottom-2"
    />

    <div class="flex flex-column flex-center margin-top-2">
      <div class="flex">
        <span class="font-size-20 font-outline font-weight-900">{{
          $t("mine-strg", { size: maxStorage, lvl: storageLvl + 1 })
        }}</span>
        <template v-if="!storageAtMaxLvl">
          <span class="nav-arrow margin-left-1 margin-right-1"></span>
          <span class="font-size-20 font-outline font-weight-900 rarity-rare">{{
            $t("mine-strg-n", { size: nextMaxStorage })
          }}</span>
        </template>
      </div>

      <PurchaseButton
        v-if="!storageAtMaxLvl"
        type="grey"
        :soft="true"
        class="margin-top-1 flex-self-start"
        @click="$emit('upgrade-storage')"
        :price="storagePrice"
      >
        {{ $t("btn-upgrade") }}
      </PurchaseButton>
      <CustomButton v-else type="grey" :disabled="true">{{
        $t("mine-max")
      }}</CustomButton>
    </div>

    <CustomButton type="yellow" @click="$emit('collect')" :disabled="gold < 1">
      {{ $t("btn-collect") }}
    </CustomButton>
  </div>
</template>

<script>
/* eslint-disable no-console */

import CustomButton from "@/components/Button.vue";
import ProgressBar from "@/components/ProgressBar.vue";
import GoldMineGoldGetterMixin from "./GoldMineGoldGetterMixin.vue";
import PurchaseButton from "@/components/PurchaseButton.vue";

export default {
  mixins: [GoldMineGoldGetterMixin],
  components: {
    ProgressBar,
    CustomButton,
    PurchaseButton
  },
  props: ["disabled"],
  data: () => ({
    gold: 0
  }),
  mounted() {
    this.interval = setInterval(this.updateGold.bind(this), 1000);
    this.updateGold();
  },
  watch: {
    "$game.goldMines": {
      deep: true,
      handler() {
        console.log("goldMines");
        this.updateGold();
      }
    }
  },
  destroyed() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  },
  methods: {
    updateGold() {
      this.gold = this.getGold();
    },
    upgradeGradeStorageHandler() {
      this.$emit("upgrade-storage");
    }
  }
};
</script>

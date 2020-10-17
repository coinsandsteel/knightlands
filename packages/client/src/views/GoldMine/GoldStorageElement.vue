<template>
  <div
    class="flex flex-space-between flex-items-end color-panel-2 padding-left-2 padding-right-2"
  >
    <ProgressBar :maxValue="maxStorage" v-model="gold" class="margin-bottom-2" />

    <div class="flex flex-column flex-center margin-top-2">
      <span class="font-size-20 font-outline font-weight-900">{{
        $t("mine-strg", { size: maxStorage, lvl: storageLvl + 1 })
      }}</span>
      <CustomButton
        type="grey"
        class="margin-top-1"
        @click="$emit('upgrade-storage')"
        :disabled="cantUpgradeStorage"
      >
        {{ $t("btn-upgrade") }}
        <IconWithValue iconClass="icon-gold">{{ storagePrice }}</IconWithValue>
      </CustomButton>
    </div>

    <CustomButton
      type="yellow"
      @click="$emit('collect')"
      :disabled="gold < 1"
    >
      {{ $t("btn-collect") }}
    </CustomButton>
  </div>
</template>

<script>
import IconWithValue from "@/components/IconWithValue.vue";
import CustomButton from "@/components/Button.vue";
import ProgressBar from "@/components/ProgressBar.vue";
import MinesMeta from "@/mines_meta";

export default {
  components: {
    ProgressBar,
    CustomButton,
    IconWithValue
  },
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
    storageLvl() {
      return this.$game.goldMines.storage.level;
    },
    maxStorage() {
      return MinesMeta.storage[this.storageLvl].size;
    },
    storagePrice() {
      return MinesMeta.storage[this.storageLvl].price;
    },
    cantUpgradeStorage() {
      return this.storagePrice > this.$game.softCurrency;
    }
  },
  methods: {
    updateGold() {
      let goldMinedTotal = 0;

      for (const mine of this.$game.goldMines.mines) {
        const timePassed = this.$game.nowSec - mine.lastUpdate;
        let goldMined = timePassed * MinesMeta.mines[mine.level].rate;
        goldMinedTotal += goldMined;
      }

      this.gold = Math.floor(
        this.$game.goldMines.storage.gold + goldMinedTotal
      );

      if (this.gold > this.maxStorage) {
        this.gold = this.maxStorage;
      }
    }
  }
};
</script>

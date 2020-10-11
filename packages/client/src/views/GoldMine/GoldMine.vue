<template>
  <PromisedView :promise="request" class="screen-content list-shadow">
    <template v-slot:fixed>
      <div class="screen-background"></div>

      <div v-bar>
        <div>
          <GoldMineElement
            v-for="(mine, idx) in mines"
            :key="idx"
            :mine="mine"
            :idx="idx"
            @upgrade-rate="handleRateUpgrade"
            @upgrade-storage="handleStorageUpgrade"
            @collect="handleCollectGold"
          />

          <GoldMineExpandElement
            :price="expandPrice"
            v-if="hasExpandableSlots"
            @expand="handleExpansion"
          />
        </div>
      </div>
    </template>
  </PromisedView>
</template>

<script>
import AppSection from "@/AppSection.vue";
import GoldMineElement from "./GoldMineElement.vue";
import GoldMineExpandElement from "./GoldMineExpandElement.vue";
import MinesMeta from "@/mines_meta";
import PromisedView from "@/components/PromisedView.vue";
import NetworkRequestErrorMixin from "@/components/NetworkRequestErrorMixin.vue";

export default {
  mixins: [AppSection, NetworkRequestErrorMixin],
  components: { GoldMineElement, GoldMineExpandElement, PromisedView },
  data: () => ({
    request: null
  }),
  created() {
    this.title = "gold-mine";
  },
  computed: {
    hasExpandableSlots() {
      return MinesMeta.addMines.length > this.mines.length - 1;
    },
    expandPrice() {
      if (!this.hasExpandableSlots) {
        return 0;
      }

      return MinesMeta.addMines[this.mines.length - 1];
    },
    mines() {
      return this.$game.goldMines.mines;
    }
  },
  methods: {
    async handleRateUpgrade(mineIndex) {
      this.request = this.performRequest(
        this.$game.upgradeGoldMineRate(mineIndex)
      );
    },
    async handleStorageUpgrade(mineIndex) {
      this.request = this.performRequest(
        this.$game.upgradeGoldMineStorage(mineIndex)
      );
    },
    async handleExpansion() {
      this.request = this.performRequest(this.$game.expandGoldMine());
    },
    async handleCollectGold(mineIndex) {
      this.request = this.performRequest(this.$game.collectGoldMine(mineIndex));
    }
  }
};
</script>

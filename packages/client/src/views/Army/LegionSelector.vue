<template>
  <div class="bg flex flex-center width-100">
    <div class="width-80 flex flex-space-between flex-items-center">
      <span
        class="nav-arrow left"
        @click="goToPreviousLegion"
        v-if="totalLegions > 1"
      ></span>
      <span class="font-size-20">{{
        $t("legion-n", { n: this.legionIndex + 1 })
      }}</span>
      <div class="flex flex-center">
        <span class="margin-right-1 font-size-18">{{ $t("damage") }}</span>
        <span class="font-size-20 font-weight-900">{{ damage }}</span>
      </div>
      <span
        class="nav-arrow"
        @click="goToNextLegion"
        v-if="totalLegions > 1"
      ></span>
    </div>
  </div>
</template>

<script>
export default {
  props: ["legion", "army"],
  data: () => ({
    legionIndex: 0
  }),
  watch: {
    legion: {
      immediate: true,
      handler() {
        this.legionIndex = this.legion || 0;
      }
    }
  },
  computed: {
    damage() {
      return this.army.getLegionDamage(
        this.legionIndex,
        this.$game.character.maxStats
      ).totalDamageOutput;
    },
    totalLegions() {
      return this.army.totalLegions();
    }
  },
  methods: {
    goToPreviousLegion() {
      this.legionIndex--;
      this.wrapAndEmitLegionChanged();
    },
    goToNextLegion() {
      this.legionIndex++;
      this.wrapAndEmitLegionChanged();
    },
    wrapAndEmitLegionChanged() {
      if (this.legionIndex < 0) {
        this.legionIndex = this.totalLegions - 1;
      } else if (this.legionIndex == this.totalLegions) {
        this.legionIndex = 0;
      }

      this.$emit("legionChange", this.legionIndex);
    }
  }
};
</script>

<style scoped>
.bg {
  background-color: #17395c;
  height: 4rem;
}
</style>

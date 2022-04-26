<template>
  <div
    class="battle-board-cell-container relative pointer"
    @click="clickHandler"
  >
    <div class="april-board-cell absolute-stretch">
      <!-- available move -->
      <Transition name="__fade" appear>
        <div
          v-if="isAvailableMove"
          class="battle-board-cell-available-move absolute-stretch"
        />
      </Transition>
      <!-- unit -->
      <div
        v-if="isUnit"
        class="battle-board-cell-unit-wrapper absolute-stretch"
      >
        <div class="battle-board-cell-unit absolute-stretch"></div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  props: {
    index: Number
    // card: Object
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters("battle", ["selectedUnit", "units", "availableMoves"]),
    isUnit() {
      return this.units.map(({ index }) => index).includes(this.index);
    },
    unit() {
      if (!this.isUnit) {
        return null;
      }

      return this.units.find(({ index }) => index === this.index);
    },
    isAvailableMove() {
      return this.availableMoves.includes(this.index);
    }
  },
  methods: {
    clickHandler() {
      this.$emit("click", {
        index: this.index,
        isUnit: this.isUnit,
        unit: this.unit,
        isAvailableMove: this.isAvailableMove
      });
    }
  }
};
</script>
<style scoped lang="scss">
.battle-board-cell-container {
  width: calc(var(--base-size) * 0.8);
  height: calc(var(--base-size) * 0.8);
  background: #ccc;
  border: 1px solid #666;
}
.battle-board-cell-available-move {
  background: blue;
  opacity: 0.5;
}
.battle-board-cell-unit {
  background: url("/images/battle/unit.png") center/80% no-repeat;
}
</style>

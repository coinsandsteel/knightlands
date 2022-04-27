<template>
  <div
    class="battle-board-cell-container relative"
    :class="{
      pointer: isClickable,
      'z-index-1': isUnitMoveActive
    }"
    @click="clickHandler"
  >
    <div class="april-board-cell absolute-stretch">
      <!-- available move -->
      <Transition name="fade" appear>
        <div
          v-if="isAvailableMove"
          class="battle-board-cell-available-move absolute-stretch"
        />
      </Transition>
      <!-- enemy available move -->
      <Transition name="fade" appear>
        <div
          v-if="isEnemyAvailableMove"
          class="battle-board-cell-enemy-available-move absolute-stretch"
        />
      </Transition>
      <!-- unit -->
      <Transition @enter="unitEnterHandler" @leave="unitLeaveHandler">
        <div
          v-if="isUnit"
          class="battle-board-cell-unit-wrapper absolute-stretch"
          :class="[
            `unit-move-length-${moveLength}`,
            {
              'unit-move-active': isUnitMoveActive
            }
          ]"
        >
          <div class="battle-board-cell-unit absolute-stretch"></div>
        </div>
      </Transition>
      <!-- enemy -->
      <div
        v-if="isEnemy"
        class="battle-board-cell-enemy-wrapper absolute-stretch"
      >
        <div class="battle-board-cell-enemy absolute-stretch"></div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { sleep } from "@/helpers/utils";
export default {
  props: {
    index: Number
    // card: Object
  },
  data() {
    return {
      previousUnitIndex: -1,
      isUnitMoveActive: false,
      moveLength: 0
    };
  },
  computed: {
    ...mapGetters("battle", [
      "units",
      "selectedUnit",
      "availableMoves",
      "enemies",
      "selectedEnemy",
      "enemyAvailableMoves"
    ]),
    isUnit() {
      return this.units.map(({ index }) => index).includes(this.index);
    },
    unit() {
      if (!this.isUnit) {
        return null;
      }

      return this.units.find(({ index }) => index === this.index);
    },
    unitIndex() {
      return this.selectedUnit ? this.selectedUnit.index : -1;
    },
    isAvailableMove() {
      return this.availableMoves.includes(this.index);
    },
    isEnemy() {
      return this.enemies.map(({ index }) => index).includes(this.index);
    },
    enemy() {
      if (!this.isEnemy) {
        return null;
      }

      return this.enemies.find(({ index }) => index === this.index);
    },
    isEnemyAvailableMove() {
      return this.enemyAvailableMoves.includes(this.index);
    },
    isClickable() {
      return (
        this.isUnit ||
        this.isEnemy ||
        this.isAvailableMove ||
        this.isEnemyAvailableMove
      );
    }
  },
  watch: {
    unitIndex(value) {
      if (!(value > -1)) {
        return;
      }

      this.previousUnitIndex = value;
    }
  },
  methods: {
    clickHandler() {
      this.$emit("click", {
        index: this.index,
        isUnit: this.isUnit,
        unit: this.unit,
        isAvailableMove: this.isAvailableMove,
        isEnemy: this.isEnemy,
        enemy: this.enemy,
        isEnemyAvailableMove: this.isEnemyAvailableMove
      });
    },
    async unitEnterHandler(el, done) {
      if (!(this.previousUnitIndex !== this.index)) {
        done();
        return;
      }

      console.log(`move from ${this.previousUnitIndex} to ${this.index}`);
      const xDiff = (this.index % 5) - (this.previousUnitIndex % 5);
      const yDiff =
        Math.floor(this.index / 5) - Math.floor(this.previousUnitIndex / 5);
      const diff = Math.max(Math.abs(xDiff), Math.abs(yDiff));
      this.moveLength = diff;
      el.style = `transform: translate(calc(${-xDiff *
        0.8} * var(--base-size)), calc(${-yDiff * 0.8} * var(--base-size)));`;
      this.isUnitMoveActive = true;
      await sleep(10);
      el.removeAttribute("style");
      const animationLength = [0, 200, 300, 380, 440, 480, 500, 510];
      await sleep(animationLength[diff]);
      this.isUnitMoveActive = false;

      done();
    },
    unitLeaveHandler(el, done) {
      console.log("unit leave", this.index);
      done();
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
.battle-board-cell-enemy-available-move {
  background: red;
  opacity: 0.5;
}
.battle-board-cell-unit {
  background: url("/images/battle/unit.png") center/60% no-repeat;
}
.battle-board-cell-enemy {
  background: url("/images/battle/enemy.png") center/100% no-repeat;
}
.unit-move-active {
  &.unit-move-length-1 {
    transition: transform 0.2s;
  }
  &.unit-move-length-2 {
    transition: transform 0.3s;
  }
  &.unit-move-length-3 {
    transition: transform 0.38s;
  }
  &.unit-move-length-4 {
    transition: transform 0.44s;
  }
  &.unit-move-length-5 {
    transition: transform 0.48s;
  }
  &.unit-move-length-6 {
    transition: transform 0.5s;
  }
  &.unit-move-length-7 {
    transition: transform 0.51s;
  }
}
</style>

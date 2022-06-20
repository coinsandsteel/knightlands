<template>
  <div
    class="battle-board-cell-container relative"
    :class="{
      pointer: isClickable,
      'z-index-1': isUnitMoveActive
    }"
    @click="clickHandler"
  >
    <div class="battle-board-cell absolute-stretch">
      <!-- terrain -->
      <div
        v-if="terrain"
        class="battle-board-cell-terrain absolute-stretch"
        :class="'battle-board-cell-terrain--' + terrain.terrainClass"
      />
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
            `move-length-${unitMoveLength}`,
            {
              'unit-move-active': isUnitMoveActive
            }
          ]"
        >
          <!-- <div class="battle-board-cell-unit absolute-stretch"></div>
          <div
            class="battle-board-cell-unit-border absolute-stretch"
            :class="'battle-board-cell-unit-border--' + unit.tier"
          ></div> -->
          <BattleUnit
            class="battle-board-cell-unit absolute"
            :class="[
              `move-length-${unitMoveLength}`,
              {
                'unit-move-active': isUnitMoveActive
              }
            ]"
            :unit="unit"
          />
        </div>
      </Transition>
      <!-- enemy -->
      <Transition @enter="enemyEnterHandler" @leave="enemyLeaveHandler">
        <div
          v-if="isEnemy"
          class="battle-board-cell-enemy-wrapper absolute-stretch"
          :class="[
            `move-length-${enemyMoveLength}`,
            {
              'enemy-move-active': isEnemyMoveActive
            }
          ]"
        >
          <div class="battle-board-cell-enemy absolute-stretch"></div>
        </div>
      </Transition>
      <div class="effect-wrapper absolute-stretch"></div>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapState } from "vuex";
import { sleep } from "@/helpers/utils";
import BattleUnit from "@/views/Battle/BattleUnit.vue";
export default {
  components: {
    BattleUnit
  },
  props: {
    index: Number
    // card: Object
  },
  data() {
    return {
      previousUnitIndex: -1,
      isUnitMoveActive: false,
      unitMoveLength: 0,
      previousEnemyIndex: -1,
      isEnemyMoveActive: false,
      enemyMoveLength: 0
    };
  },
  computed: {
    ...mapState("battle", ["game"]),
    ...mapGetters("battle", [
      "units",
      "selectedUnit",
      "moveCells",
      "enemyUnits",
      "enemySelectedUnit",
      "enemyMoveCells"
    ]),
    isUnit() {
      return this.units.map(({ index }) => index).includes(this.index);
    },
    terrain() {
      return this.game.terrain.find(({ index }) => index === this.index);
    },
    unit() {
      if (!this.isUnit) {
        return null;
      }

      return this.units.find(({ index }) => index === this.index);
    },
    unitIndex() {
      // return this.selectedUnit ? this.selectedUnit.index : -1;
      return this.unit ? this.unit.index : -1;
    },
    isAvailableMove() {
      return this.moveCells.includes(this.index);
    },
    isEnemy() {
      return this.enemyUnits.map(({ index }) => index).includes(this.index);
    },
    enemyIndex() {
      return this.enemySelectedUnit ? this.enemySelectedUnit.index : -1;
    },
    enemy() {
      if (!this.isEnemy) {
        return null;
      }

      return this.enemyUnits.find(({ index }) => index === this.index);
    },
    isEnemyAvailableMove() {
      return this.enemyMoveCells.includes(this.index);
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

      if (!(this.unit && this.unit.unitId && this.unit.oldIndex > -1)) {
        this.previousUnitIndex = null;
        return;
      }

      this.previousUnitIndex = this.unit.oldIndex;

      // if (
      //   this.unit &&
      //   this.unit.unitId &&
      //   this.unitIndexes &&
      //   this.unitIndexes[this.unit.unitId]
      // ) {
      //   let previousUnitIndex = -1;
      //   for (
      //     let i = this.unitIndexes[this.unit.unitId].length - 1;
      //     i > 0;
      //     i--
      //   ) {
      //     if (value === this.unitIndexes[this.unit.unitId][i]) {
      //       previousUnitIndex = this.unitIndexes[this.unit.unitId][i - 1];
      //       break;
      //     }
      //   }

      //   this.previousUnitIndex = previousUnitIndex;
      // }

      // this.previousUnitIndex = value;
    },
    enemyIndex(value) {
      if (!(value > -1)) {
        return;
      }

      this.previousEnemyIndex = value;
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
      if (
        !(this.previousUnitIndex > -1 && this.previousUnitIndex !== this.index)
      ) {
        done();
        return;
      }

      console.log(`move from ${this.previousUnitIndex} to ${this.index}`);
      const xDiff = (this.index % 5) - (this.previousUnitIndex % 5);
      const yDiff =
        Math.floor(this.index / 5) - Math.floor(this.previousUnitIndex / 5);
      const diff = Math.max(Math.abs(xDiff), Math.abs(yDiff));
      this.unitMoveLength = diff;
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
    },
    async enemyEnterHandler(el, done) {
      if (!(this.previousEnemyIndex !== this.index)) {
        done();
        return;
      }

      console.log(`move from ${this.previousEnemyIndex} to ${this.index}`);
      const xDiff = (this.index % 5) - (this.previousEnemyIndex % 5);
      const yDiff =
        Math.floor(this.index / 5) - Math.floor(this.previousEnemyIndex / 5);
      const diff = Math.max(Math.abs(xDiff), Math.abs(yDiff));
      this.enemyMoveLength = diff;
      el.style = `transform: translate(calc(${-xDiff *
        0.8} * var(--base-size)), calc(${-yDiff * 0.8} * var(--base-size)));`;
      this.isEnemyMoveActive = true;
      await sleep(10);
      el.removeAttribute("style");
      const animationLength = [0, 200, 300, 380, 440, 480, 500, 510];
      await sleep(animationLength[diff]);
      this.isEnemyMoveActive = false;

      done();
    },
    enemyLeaveHandler(el, done) {
      console.log("enemy leave", this.index);
      done();
    }
  }
};
</script>
<style scoped lang="less">
.battle-board-cell-container {
  width: calc(var(--base-size) * 0.8);
  height: calc(var(--base-size) * 0.8);
  // background: #ccc;
  // border: 1px solid transparent;
  // background-size: 100% 100%;
}
.battle-board-cell-terrain {
  // background: green;
  // opacity: 0.5;
  background-size: 100% 100%;
}
.battle-board-cell-terrain--grass {
  background-image: url("/images/battle/tiles/grass.png");
}
.battle-board-cell-terrain--grass_hill {
  background-image: url("/images/battle/tiles/grass_hill.png");
}
.battle-board-cell-terrain--grass_swamp {
  background-image: url("/images/battle/tiles/grass_swamp.png");
}
.battle-board-cell-terrain--grass_swamp_a {
  background-image: url("/images/battle/tiles/grass_swamp_a.png");
}
.battle-board-cell-terrain--grass_swamp_b {
  background-image: url("/images/battle/tiles/grass_swamp_b.png");
}
.battle-board-cell-terrain--grass_swamp_c {
  background-image: url("/images/battle/tiles/grass_swamp_c.png");
}
.battle-board-cell-terrain--grass_swamp_d {
  background-image: url("/images/battle/tiles/grass_swamp_d.png");
}
.battle-board-cell-terrain--grass_swamp_x {
  background-image: url("/images/battle/tiles/grass_swamp_x.png");
}
.battle-board-cell-terrain--grass_swamp_y {
  background-image: url("/images/battle/tiles/grass_swamp_y.png");
}
.battle-board-cell-terrain--grass_swamp_z {
  background-image: url("/images/battle/tiles/grass_swamp_z.png");
}
.battle-board-cell-terrain--grass_swamp1 {
  background-image: url("/images/battle/tiles/grass_swamp1.png");
}
.battle-board-cell-terrain--grass_swamp2 {
  background-image: url("/images/battle/tiles/grass_swamp2.png");
}
.battle-board-cell-terrain--grass_woods {
  background-image: url("/images/battle/tiles/grass_woods.png");
}
.battle-board-cell-terrain--sand {
  background-image: url("/images/battle/tiles/sand.png");
}
.battle-board-cell-terrain--sand_hill {
  background-image: url("/images/battle/tiles/sand_hill.png");
}
.battle-board-cell-terrain--sand_lava {
  background-image: url("/images/battle/tiles/sand_lava.png");
}
.battle-board-cell-terrain--sand_lava_a {
  background-image: url("/images/battle/tiles/sand_lava_a.png");
}
.battle-board-cell-terrain--sand_lava_b {
  background-image: url("/images/battle/tiles/sand_lava_b.png");
}
.battle-board-cell-terrain--sand_lava_c {
  background-image: url("/images/battle/tiles/sand_lava_c.png");
}
.battle-board-cell-terrain--sand_lava_d {
  background-image: url("/images/battle/tiles/sand_lava_d.png");
}
.battle-board-cell-terrain--sand_lava1 {
  background-image: url("/images/battle/tiles/sand_lava1.png");
}
.battle-board-cell-terrain--sand_lava2 {
  background-image: url("/images/battle/tiles/sand_lava2.png");
}
.battle-board-cell-terrain--sand_quicksand {
  background-image: url("/images/battle/tiles/sand_quicksand.png");
}
.battle-board-cell-terrain--sand_thorns {
  background-image: url("/images/battle/tiles/sand_thorns.png");
}
.battle-board-cell-terrain--snow {
  background-image: url("/images/battle/tiles/snow.png");
}
.battle-board-cell-terrain--snow_hill {
  background-image: url("/images/battle/tiles/snow_hill.png");
}
.battle-board-cell-terrain--snow_ice {
  background-image: url("/images/battle/tiles/snow_ice.png");
}
.battle-board-cell-terrain--snow_ice_1 {
  background-image: url("/images/battle/tiles/snow_ice_1.png");
}
.battle-board-cell-terrain--snow_ice_1-1 {
  background-image: url("/images/battle/tiles/snow_ice_1-1.png");
}
.battle-board-cell-terrain--snow_ice_a {
  background-image: url("/images/battle/tiles/snow_ice_a.png");
}
.battle-board-cell-terrain--snow_ice_b {
  background-image: url("/images/battle/tiles/snow_ice_b.png");
}
.battle-board-cell-terrain--snow_ice_c {
  background-image: url("/images/battle/tiles/snow_ice_c.png");
}
.battle-board-cell-terrain--snow_ice_d {
  background-image: url("/images/battle/tiles/snow_ice_d.png");
}
.battle-board-cell-terrain--snow_woods {
  background-image: url("/images/battle/tiles/snow_woods.png");
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
  width: 100%;
  top: 1px;
  left: 0;
  height: 100%;
}
// .battle-board-cell-unit {
//   background: url("/images/battle/unit.png") center/60% no-repeat;
// }
// .battle-board-cell-unit-border--1 {
// }
.battle-board-cell-enemy {
  background: url("/images/battle/enemy.png") center/100% no-repeat;
}
.unit-move-active,
.enemy-move-active {
  &.move-length-1 {
    transition: transform 0.2s;
  }
  &.move-length-2 {
    transition: transform 0.3s;
  }
  &.move-length-3 {
    transition: transform 0.38s;
  }
  &.move-length-4 {
    transition: transform 0.44s;
  }
  &.move-length-5 {
    transition: transform 0.48s;
  }
  &.move-length-6 {
    transition: transform 0.5s;
  }
  &.move-length-7 {
    transition: transform 0.51s;
  }
}

// animation
.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
  transform: scale(0);
}
</style>

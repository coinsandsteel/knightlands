<template>
  <div
    class="battle-side-cell-container relative"
    :class="{
      pointer: isClickable
    }"
    @click="clickHandler"
  >
    <div class="battle-side-cell absolute-stretch">
      <BattleUnit
        class="battle-side-cell-unit absolute"
        :unit="fighter"
        :isEnemy="isEnemy"
        :shouldShowExtraInfo="true"
        :isSmallRatingIndex="true"
        :isBuffIndicatorVisible="true"
        :isBuffIndicatorSmall="true"
        :isHpVisible="false"
        :ratingIndex="fighter ? fighter.ratingIndex : null"
        :isBossIconVisible="isEnemy"
      />
    </div>
  </div>
</template>
<script>
import { mapGetters, mapState } from "vuex";
// import { sleep } from "@/helpers/utils";
import BattleUnit from "@/views/Battle/BattleUnit.vue";
export default {
  components: {
    BattleUnit
  },
  props: {
    // index: Number
    // card: Object
    fighter: Object
  },
  data() {
    return {};
  },
  computed: {
    ...mapState("battle", ["game"]),
    ...mapGetters("battle", [
      "fighters",
      "selectedUnit",
      "moveCells",
      "attackCells",
      "enemyFighters"
      // "enemySelectedUnit"
      // "enemyMoveCells"
    ]),
    isUnit() {
      return this.fighters
        .filter(Boolean)
        .map(({ fighterId }) => fighterId)
        .includes(this.fighter.fighterId);
    },
    unit() {
      if (!this.isUnit) {
        return null;
      }

      return this.fighters.find(
        fighter => fighter && fighter.index === this.index
      );
    },
    // unitIndex() {
    //   // return this.selectedUnit ? this.selectedUnit.index : -1;
    //   return this.unit ? this.unit.index : -1;
    // },
    isEnemy() {
      return this.enemyFighters
        .map(fighter => (fighter ? fighter.fighterId : null))
        .includes(this.fighter.fighterId);
    },
    enemy() {
      if (!this.isEnemy) {
        return null;
      }

      return this.enemyFighters.find(
        fighter => fighter && fighter.index === this.index
      );
    },
    // enemyIndex() {
    //   // return this.enemySelectedUnit ? this.enemySelectedUnit.index : -1;
    //   return this.enemy ? this.enemy.index : -1;
    // },
    isClickable() {
      return true;
    }
  },
  methods: {
    clickHandler() {
      this.$emit("click", {
        // index: this.index,
        // isUnit: this.isUnit,
        // unit: this.unit,
        // isMoveCell: this.isMoveCell,
        // isAttackCell: this.isAttackCell,
        // isEnemy: this.isEnemy,
        // enemy: this.enemy
        // isEnemyAvailableMove: this.isEnemyAvailableMove
      });
    }
  }
};
</script>
<style scoped lang="less">
.battle-side-cell-container {
  width: calc(var(--base-size) * 0.5);
  height: calc(var(--base-size) * 0.5);
  // background: #ccc;
  // border: 1px solid transparent;
  // background-size: 100% 100%;
}
.battle-side-cell-unit {
  width: 100%;
  top: 1px;
  left: 0;
  height: 100%;
}
</style>

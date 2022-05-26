<template>
  <div
    class="battle-play-field width-100 height-100 dummy-height flex flex-column flex-no-wrap overflow-hidden"
    :style="{ '--base-size': `${baseSize}px` }"
  >
    <!-- play board -->
    <div class="battle-play-board-border-outer flex flex-center flex-grow-1">
      <div class="battle-play-board-border relative">
        <div class="battle-play-board-background absolute-stretch"></div>
        <div class="battle-play-board">
          <BattleBoardCell
            v-for="(cell, cellIndex) in boardCells"
            :key="cellIndex"
            :index="cellIndex"
            @click="cellClickHandler(cell, cellIndex, $event)"
          />
        </div>
      </div>
    </div>
    <Transition name="fade" appear>
      <BattleAbilitySelect
        v-if="abilitySelectResolve"
        :enemy="clickedEnemy"
        @close="abilitySelectCloseHandler"
      />
    </Transition>
  </div>
</template>
<script>
import { mapState, mapGetters } from "vuex";
import cloneDeep from "lodash/cloneDeep";
import BattleBoardCell from "@/views/Battle/BattleBoardCell.vue";
import BattleAbilitySelect from "@/views/Battle/BattleAbilitySelect.vue";

export default {
  components: {
    BattleBoardCell,
    BattleAbilitySelect
  },
  data() {
    return {
      abilitySelectResolve: null,
      clickedEnemy: null
    };
  },
  computed: {
    ...mapState(["appSize"]),
    // ...mapState("battle", ["units", "enemies"]),
    ...mapGetters("battle", [
      "units",
      "enemyUnits",
      "isMyTurn",
      "selectedUnitId",
      "enemySelectedUnitId"
    ]),
    baseSize() {
      return this.appSize
        ? Math.floor(this.appSize.width / 6)
        : Math.floor(375 / 6);
    },
    boardCells() {
      return new Array(5 * 7).fill(null);
    }
  },
  methods: {
    async showAbilitySelect() {
      return new Promise(resolve => {
        this.abilitySelectResolve = resolve;
      });
    },
    abilitySelectCloseHandler(event) {
      if (!this.abilitySelectResolve) {
        return;
      }

      this.abilitySelectResolve(event);
      this.abilitySelectResolve = null;
    },
    async cellClickHandler(cell, index, event) {
      console.log("cell", cell);
      console.log("index", index);
      console.log("event", event);
      console.log("selectedUnitId", this.selectedUnitId);
      console.log("isMyTurn", this.isMyTurn);

      if (!this.isMyTurn) {
        if (event.isEnemy) {
          this.$store.commit("battle/updateState", {
            enemySelectedUnitId: event.enemy.unitId,
            enemyMoveCells: [
              index + 5,
              index + 4,
              index + 6,
              index + 10,
              index + 15,
              index + 20,
              index + 25,
              index + 30,
              index + 35
            ]
          });

          return;
        }

        if (event.isEnemyAvailableMove) {
          const enemyUnits = cloneDeep(this.enemyUnits) || [];
          const enemy = enemyUnits.find(
            ({ unitId }) => unitId === this.enemySelectedUnitId
          );
          enemy.index = index;
          this.$store.commit("battle/updateState", {
            enemySelectedUnitId: null,
            enemyAvailableMoves: [],
            enemyUnits
          });

          this.$store.commit("battle/updateState", {
            isMyTurn: true
          });
        }

        return;
      }

      if (event.isUnit) {
        if (this.selectedUnitId === event.unit.unitId) {
          this.$store.commit("battle/updateState", {
            selectedUnitId: null,
            moveCells: []
          });
          return;
        }
        this.$store.commit("battle/updateState", {
          selectedUnitId: event.unit.unitId,
          moveCells: [
            index - 5,
            index - 4,
            index - 6,
            index - 10,
            index - 15,
            index - 20,
            index - 25,
            index - 30,
            index - 35
          ]
        });
      }

      if (event.isAvailableMove && !event.isEnemy) {
        const units = cloneDeep(this.units) || [];
        const unit = units.find(({ unitId }) => unitId === this.selectedUnitId);
        unit.index = index;
        this.$store.commit("battle/updateState", {
          selectedUnitId: null,
          moveCells: [],
          units
        });

        this.$store.commit("battle/updateState", {
          isMyTurn: false
        });
      }

      if (event.isAvailableMove && event.isEnemy) {
        this.clickedEnemy = cloneDeep(event.enemy);
        this.$store.commit("battle/updateState", {
          moveCells: []
        });
        const result = await this.showAbilitySelect();

        console.log("result", result);

        this.clickedEnemy = null;
        this.$store.commit("battle/updateState", {
          selectedUnitId: null
        });

        this.$store.commit("battle/updateState", {
          isMyTurn: false
        });
        return;
      }
    }
  }
};
</script>
<style scoped lang="less">
.battle-play-board {
  display: grid;
  grid-template-columns: repeat(5, calc(var(--base-size) * 0.8));
}
</style>

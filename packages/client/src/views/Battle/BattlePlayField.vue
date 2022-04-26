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
    <BattleAbilitySelect
      v-if="abilitySelectResolve"
      @close="abilitySelectCloseHandler"
    />
  </div>
</template>
<script>
import { mapState, mapGetters } from "vuex";
import BattleBoardCell from "@/views/Battle/BattleBoardCell.vue";
import BattleAbilitySelect from "@/views/Battle/BattleAbilitySelect.vue";

export default {
  components: {
    BattleBoardCell,
    BattleAbilitySelect
  },
  data() {
    return {
      abilitySelectResolve: null
    };
  },
  computed: {
    ...mapState(["appSize"]),
    ...mapState("battle", ["units"]),
    ...mapGetters("battle", ["selectedUnitId"]),
    baseSize() {
      return this.appSize
        ? Math.floor(this.appSize.width / 6)
        : Math.floor(375 / 6);
    },
    boardCells() {
      return new Array(5 * 8).fill(null);
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

      if (event.unit && !event.unit.isEnemy) {
        if (this.selectedUnitId === event.unit.id) {
          this.$store.commit("battle/updateState", {
            selectedUnitId: null,
            availableMoves: []
          });
          return;
        }
        this.$store.commit("battle/updateState", {
          selectedUnitId: event.unit.id,
          availableMoves: [index - 5, index - 4, index - 6, index - 10]
        });
      }
      if (event.isAvailableMove) {
        if (event.unit && event.unit.isEnemy) {
          const result = await this.showAbilitySelect();
          console.log("result", result);
          this.$store.commit("battle/updateState", {
            selectedUnitId: null,
            availableMoves: []
          });
          return;
        }
        const units = [...this.units];
        const unit = this.units.find(({ id }) => id === this.selectedUnitId);
        unit.index = index;
        this.$store.commit("battle/updateState", {
          selectedUnitId: null,
          availableMoves: [],
          units
        });
      }
    }
  }
};
</script>
<style scoped lang="scss">
.battle-play-board {
  display: grid;
  grid-template-columns: repeat(5, calc(var(--base-size) * 0.8));
}
</style>

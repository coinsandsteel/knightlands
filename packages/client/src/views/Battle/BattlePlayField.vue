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
            @click="cellClickHandler(cell, cellIndex)"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapGetters } from "vuex";
import BattleBoardCell from "@/views/Battle/BattleBoardCell.vue";

export default {
  components: {
    BattleBoardCell
  },
  data() {
    return {};
  },
  computed: {
    ...mapState(["appSize"]),
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
    cellClickHandler() {}
  }
};
</script>
<style scoped lang="scss">
.battle-play-board {
  display: grid;
  grid-template-columns: repeat(5, calc(var(--base-size) * 0.8));
}
</style>

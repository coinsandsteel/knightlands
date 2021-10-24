<template>
  <div class="width-100 dungeon-grid" ref="wrapper" :style="cssVars">
    <MazeCell
      v-for="idx in totalCells"
      :key="`${idx - 1}_${indexToCellIndex[idx - 1]}`"
      :cell="getCellAt(indexToCellIndex[idx - 1])"
      :index="idx - 1"
      :mazeWidth="width"
      @click="handleCellClick"
    />

    <Player ref="player" class="dungeon-player" />
  </div>
</template>

<script>
import MazeCell from "./MazeCell.vue";
import Player from "./Player.vue";
import anime from "animejs";

export default {
  props: {
    dungeon: Object
  },
  components: { MazeCell, Player },
  watch: {
    dungeon: {
      immediate: true,
      handler() {
        if (!this.dungeon) {
          return;
        }

        this.init();
      }
    },
    "dungeon.revealed": {
      deep: true,
      handler() {
        this.indexCells(false);
      }
    },
    "dungeon.user.cell": {
      handler() {
        this.movePlayerToCell(this.dungeon.user.cell);
      }
    }
  },
  data: () => ({
    cellSize: 0,
    cssVars: {},
    indexToCellIndex: {}
  }),
  computed: {
    totalCells() {
      return this.height * this.width;
    },
    width() {
      return this.dungeon ? this.dungeon.width : 0;
    },
    height() {
      return this.dungeon ? this.dungeon.height : 0;
    }
  },
  methods: {
    init() {
      this.cellSize = this.$refs.wrapper.offsetWidth / this.width;

      this.$set(this.cssVars, "--height", this.height);
      this.$set(this.cssVars, "--width", this.width);
      this.$set(this.cssVars, "--item-size", this.cellSize + "px");

      this.indexCells(true);

      this.movePlayerToCell(this.dungeon.user.cell, false);
    },
    cellToIndex(cell) {
      return cell.y * this.width + cell.x;
    },
    indexCells(full) {
      if (!this.dungeon) {
        return;
      }

      const revealed = this.dungeon.revealed;

      if (full) {
        this.indexToCellIndex = {};
        for (let index = 0; index < revealed.length; index++) {
          const cell = revealed[index];
          this.$set(this.indexToCellIndex, this.cellToIndex(cell), index);
        }
      } else {
        for (let index = 0; index < revealed.length; index++) {
          const cell = revealed[index];
          const cellIndex = this.cellToIndex(cell);
          if (this.indexToCellIndex[cellIndex] === undefined) {
            this.$set(this.indexToCellIndex, cellIndex, index);
          }
        }
      }
    },
    cellToScreen(cell) {
      return {
        x: cell.x * this.cellSize,
        y: cell.y * this.cellSize
      };
    },
    getCellAt(index) {
      return this.dungeon.revealed[index];
    },
    handleCellClick(cell) {
      const index = cell.index;
      const isRevealed = this.indexToCellIndex[index] !== undefined;
      if (!isRevealed) {
        this.$emit("move", index);
      }
    },
    async movePlayerToCell(index, animated = true) {
      const targetCell = this.getCellAt(this.indexToCellIndex[index]);
      const player = this.$refs.player;
      if (!animated) {
        player.snapToPosition(this.cellToScreen(targetCell));
        return;
      }

      await player.moveToPosition(this.cellToScreen(targetCell));
    }
  }
};
</script>

<style lang="less" scoped>
.dungeon-grid {
  position: relative;
  display: grid;
  grid-template-columns: repeat(var(--width), var(--item-size));
  grid-template-rows: repeat(var(--height), var(--item-size));
  justify-content: center;
}

.dungeon-player {
  position: absolute;
  width: var(--item-size);
  height: var(--item-size);
  z-index: 1;
}
</style>

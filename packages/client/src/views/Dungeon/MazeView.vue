<template>
  <div class="width-100 dungeon-grid" ref="wrapper" :style="cssVars">
    <MazeCell
      v-for="idx in totalCells"
      :key="`${idx - 1}_${indexToCellIndex[idx - 1]}`"
      :cell="getCellAt(indexToCellIndex[idx - 1])"
      :index="idx - 1"
      :mazeWidth="width"
      :highlight="isHighlighted(idx - 1)"
      @click="handleCellClick"
    />

    <Player ref="player" class="dungeon-player" @click="handleCellClick" />
  </div>
</template>

<script>
import MazeCell from "./MazeCell.vue";
import Player from "./Player.vue";
import anime from "animejs";
import { mapGetters, mapState } from "vuex";
import PromptMixin from "@/components/PromptMixin.vue";

export default {
  mixins: [PromptMixin],
  components: { MazeCell, Player },
  watch: {
    loaded: {
      immediate: true,
      handler(value) {
        if (value) {
          this.$nextTick(function() {
            this.init();
          });
        }
      },
    },
    "maze.revealed": {
      deep: true,
      handler(newer, old) {
        this.indexCells(newer.length <= old.length);
      }
    },
    "user.cell": {
      handler(value) {
        this.movePlayerToCell(value);
      },
    },
  },
  mounted() {
    this._resize = this.init.bind(this);
    window.addEventListener("resize", this._resize);
  },
  destroyed() {
    window.removeEventListener("resize", this._resize);
  },
  data: () => ({
    cellSize: 0,
    cssVars: {},
    indexToCellIndex: {},
  }),
  computed: {
    ...mapGetters({
      enemy: "dungeon/enemy"
    }),
    ...mapState({
      loaded: (state) => state.dungeon.loaded,
      maze: (state) => state.dungeon.maze,
      width: (state) => state.dungeon.maze.width,
      height: (state) => state.dungeon.maze.height,
      user: (state) => state.dungeon.user,
    }),
    totalCells() {
      return this.height * this.width;
    },
  },
  methods: {
    init() {
      this.cellSize = this.$refs.wrapper.offsetWidth / this.width;

      this.$set(this.cssVars, "--height", this.height);
      this.$set(this.cssVars, "--width", this.width);
      this.$set(this.cssVars, "--item-size", this.cellSize + "px");

      this.indexCells(true);

      this.movePlayerToCell(this.user.cell, false);
    },
    cellToIndex(cell) {
      return cell.y * this.width + cell.x;
    },
    indexCells(full) {
      if (!this.loaded) {
        return;
      }

      const revealed = this.maze.revealed;
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
        y: cell.y * this.cellSize,
      };
    },
    getCellAt(index) {
      return this.maze.revealed[index];
    },
    isHighlighted(cellIdx) {
      const targetCell = this.getCellAt(this.indexToCellIndex[cellIdx]);
      if (!targetCell) {
        return false;
      }

      if (
        !targetCell.trap &&
        !targetCell.enemy &&
        !targetCell.altar &&
        !targetCell.loot
      ) {
        return false;
      }
      return cellIdx == this.user.cell;
    },
    handleCellClick(cell) {
      console.log({ cell });
      let index = cell.index;
      if (index === -1) {
        index = this.user.cell;
      }
      const isRevealed = this.indexToCellIndex[index] !== undefined;
      if (!isRevealed) {
        this.revealCell(index);
      } else {
        this.interactWithCell(index, this.indexToCellIndex[index]);
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
    },
    async revealCell(cellIndex) {
      await this.$store.dispatch("dungeon/revealCell", cellIndex);
    },
    async interactWithCell(cellIndex, revealedIndex) {
      const cell = this.maze.revealed[revealedIndex];
      if (cellIndex == this.user.cell) {
        // can interact with objects where user stands
        // Custom dialog

        // actions: fight, cnc
        // actions: fight
        if (cell.enemy /*&& this.enemy.isAgressive*/) {
          // show pre-combat dialog
          /*await this.showPrompt(
            this.$t("enemy-aggressive-h"),
            this.$t("enemy-aggressive-t"),
            [
              {
                type: "red",
                title: "fight-it",
                response: true,
              },
            ]
          );*/

          this.$router.push({ name: "dungeon-fight" });
        } else if (cell.altar) {
          // actions: use, cnc
          // show altar dialog
        } else if (cell.trap) {
          // trap: use, cnc
          // show trap dialog
          await this.showPrompt(this.$t("trap-h"), this.$t("trap-t"), [
            {
              type: "red",
              title: "btn-ok",
              response: true,
            },
          ]);
        }
        // loot

        // interact with the object in the cell
        await this.$store.dispatch("dungeon/useCell", cellIndex);
      } else {
        await this.$store.dispatch("dungeon/moveToCell", cellIndex);
      }
    },
  },
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

<template>
  <div class="width-100" v-bar>
    <div class="flex relative flex-items-center padding-top-1">
      <div class="width-100 dungeon-grid" ref="wrapper" :style="cssVars">
        <MazeCell
          v-for="idx in totalCells"
          :key="`${idx - 1}_${indexToCellIndex[idx - 1]}`"
          :cell="maze.revealed[indexToCellIndex[idx - 1]]"
          :index="idx - 1"
          :mazeWidth="width"
          :highlight="isHighlighted(idx - 1)"
          @click="handleCellClick"
        />

        <Player ref="player" class="dungeon-player" />
      </div>
    </div>
  </div>
</template>

<script>
import MazeCell from "./MazeCell.vue";
import Player from "./Player.vue";
import { mapState } from "vuex";
import PromptMixin from "@/components/PromptMixin.vue";
import Erorrs from "@/../../knightlands-shared/errors";

import EnemyPopup from "./Popup/EnemyPopup.vue";
import AltarPopup from "./Popup/AltarPopup.vue";
import TrapPopup from "./Popup/TrapPopup.vue";
import LootPopup from "./Popup/LootPopup.vue";
import { create } from "vue-modal-dialogs";

const ShowEnemyPopup = create(EnemyPopup, "enemyId", "enemyCurrentHealth");
const ShowAltarPopup = create(AltarPopup, "altarId");
const ShowTrapPopup = create(TrapPopup, "trapId");
const ShowLootPopup = create(LootPopup, "lootId");

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
      }
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
      }
    }
  },
  mounted() {
    this._resize = this.init.bind(this);
    window.addEventListener("resize", this._resize);
    this.$store.$app.$on(
      "aggressive_enemy_encountered",
      this.handleAggressiveEnemy
    );
  },
  destroyed() {
    window.removeEventListener("resize", this._resize);
    this.$store.$app.$off("aggressive_enemy_encountered");
  },
  data: () => ({
    cellSize: 0,
    cssVars: {},
    indexToCellIndex: {}
  }),
  computed: {
    ...mapState({
      loaded: state => state.dungeon.loaded,
      maze: state => state.dungeon.maze,
      width: state => state.dungeon.maze.width,
      height: state => state.dungeon.maze.height,
      user: state => state.dungeon.user
    }),
    totalCells() {
      return this.height * this.width;
    },
    userCell() {
      return this.maze.revealed[this.indexToCellIndex[this.user.cell]];
    }
  },
  methods: {
    scrollToPlayer() {},
    init() {
      this.cellSize = this.$refs.wrapper.offsetWidth / this.width;

      this.$set(this.cssVars, "--height", this.height);
      this.$set(this.cssVars, "--width", this.width);
      this.$set(this.cssVars, "--item-size", this.cellSize + "px");

      this.indexCells(true);

      this.movePlayerToCell(this.user.cell, false);

      this.scrollToPlayer();
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
        y: cell.y * this.cellSize
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
    async handleCellClick(cell) {
      let index = cell.index;
      if (this.userCell.trap && index !== this.user.cell) {
        this.interactWithCell(
          this.user.cell,
          this.indexToCellIndex[this.user.cell]
        );
        return;
      }

      try {
        const isRevealed = this.indexToCellIndex[index] !== undefined;
        if (!isRevealed) {
          await this.revealCell(index);
        } else {
          await this.interactWithCell(index, this.indexToCellIndex[index]);
        }
      } catch (e) {
        if (e === Erorrs.NoEnergy) {
          this.$app.$emit("shake-energy");
        }
      }
    },
    async movePlayerToCell(index, animated = true) {
      const targetCell = this.getCellAt(this.indexToCellIndex[index]);
      const player = this.$refs.player;
      if (!animated) {
        player.snapToPosition(this.cellToScreen(targetCell));
        return;
      }

      await new Promise(resolve => {
        setTimeout(
          () => resolve(player.moveToPosition(this.cellToScreen(targetCell))),
          500
        );
      });

      if (targetCell.trap) {
        ShowTrapPopup(targetCell.trap.id);
      }
    },
    async revealCell(cellIndex) {
      await this.$store.dispatch("dungeon/revealCell", cellIndex);
    },
    async interactWithCell(cellIndex, revealedIndex) {
      const cell = this.maze.revealed[revealedIndex];

      // Click to user's current cell
      if (cellIndex == this.user.cell) {
        let response = false;

        if (cell.enemy) {
          response = await ShowEnemyPopup(cell.enemy.id, cell.enemy.health);
        } else if (cell.altar) {
          response = await ShowAltarPopup(cell.altar.id);
        } else if (cell.trap) {
          response = await ShowTrapPopup(cell.trap.id);
        } else if (cell.loot) {
          response = await ShowLootPopup(cell.loot);
        }

        if (!response) {
          return;
        }

        // interact with the object in the cell
        const cmdResponse = await this.$store.dispatch(
          "dungeon/useCell",
          cellIndex
        );

        // response only from loot
        if (cmdResponse) {
          // show loot content
          this.$store.commit("dungeon/updateLoot", cmdResponse);
        }
      } else {
        await this.$store.dispatch("dungeon/moveToCell", cellIndex);
      }
    },
    async handleAggressiveEnemy(payload) {
      await ShowEnemyPopup(payload.id, payload.health);
      this.$store.dispatch("dungeon/redirectToActiveCombat");
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

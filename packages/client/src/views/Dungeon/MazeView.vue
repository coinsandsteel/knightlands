<template>
  <div class="width-100" ref="scroll" v-bar>
    <div class="flex relative flex-items-center padding-top-1">
      <div class="width-100 dungeon-grid" ref="wrapper" :style="cssVars">
        <MazeCell
          v-for="idx in totalCells"
          :key="`${idx - 1}_${indexToCellIndex[idx - 1]}`"
          :cell="maze.revealed[indexToCellIndex[idx - 1]]"
          :index="idx - 1"
          :mazeWidth="width"
          :highlight="isHighlighted(idx - 1)"
          :pathHighlight="highlightedCells[idx - 1]"
          :energy="energyEstimation[idx - 1]"
          :random="random"
          @click="handleCellClick"
          @confirm="confirmMovement"
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

import NetworkRequestErrorMixin from "@/components/NetworkRequestErrorMixin.vue";
import EnemyPopup from "./Popup/EnemyPopup.vue";
import AltarPopup from "./Popup/AltarPopup.vue";
import TrapPopup from "./Popup/TrapPopup.vue";
import TrapJammedPopup from "./Popup/TrapJammedPopup.vue";
import LootReceivedPopup from "./Popup/LootReceivedPopup.vue";
import ExitPopup from "./Popup/ExitPopup.vue";
import { create } from "vue-modal-dialogs";

const ShowEnemyPopup = create(EnemyPopup, "enemyId", "enemyCurrentHealth");
const ShowAltarPopup = create(AltarPopup, "altarId");
const ShowTrapPopup = create(TrapPopup, "trapId");
const ShowLootReceivedPopup = create(LootReceivedPopup, "loot");
const ShowExitPopup = create(ExitPopup);
const ShowTrapJammed = create(TrapJammedPopup);

function xmur3(str) {
  for (var i = 0, h = 1779033703 ^ str.length; i < str.length; i++)
    (h = Math.imul(h ^ str.charCodeAt(i), 3432918353)),
      (h = (h << 13) | (h >>> 19));
  return function() {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return (h ^= h >>> 16) >>> 0;
  };
}

function mulberry32(a) {
  return function() {
    var t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return (t ^ (t >>> 14)) >>> 0;
  };
}

function findPos(obj, parent) {
  var curtop = 0;
  if (obj.offsetParent) {
    do {
      curtop += obj.offsetTop;
    } while ((obj = obj.offsetParent) !== parent);
    return curtop;
  }
}

export default {
  mixins: [PromptMixin, NetworkRequestErrorMixin],
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
        this.indexCells(newer.length === 1 || newer.length < old.length);
      }
    },
    "user.cell": {
      handler(value) {
        this.movePlayerToCell(value);
      }
    }
  },
  async mounted() {
    this._resize = this.init.bind(this);
    window.addEventListener("resize", this._resize);
    this.$store.$app.$on(
      "aggressive_enemy_encountered",
      this.handleAggressiveEnemy
    );
    this.$store.$app.$on("trap_jammed", this.handleJammedTrap);
  },
  activated() {
    this.scrollToPlayer();
  },
  destroyed() {
    window.removeEventListener("resize", this._resize);
    this.$store.$app.$off("aggressive_enemy_encountered");
    this.$store.$app.$off("trap_jammed");
  },
  data: () => ({
    highlightedCells: {},
    energyEstimation: {},
    firstMove: false,
    interaction: false,
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
    random() {
      return this._randomState();
    },
    scrollToPlayer() {
      this.$nextTick(() => {
        const scroll = document.querySelector(".vb-content");
        scroll.scrollTop =
          findPos(this.$refs.player.$el, scroll) - scroll.offsetHeight / 2;
      });
    },
    init() {
      this._seed = xmur3(this.$game.id + this.user.level);
      this._randomState = mulberry32(this._seed());
      this.cellSize = this.$refs.wrapper.offsetWidth / this.width;

      this.$set(this.cssVars, "--height", this.height);
      this.$set(this.cssVars, "--width", this.width);
      this.$set(this.cssVars, "--item-size", this.cellSize + "px");

      this.indexCells(true);

      this.movePlayerToCell(this.user.cell);

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

        this.firstMove = true;
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
        !targetCell.loot &&
        !targetCell.exit
      ) {
        return false;
      }
      return cellIdx == this.user.cell;
    },
    isTrapped() {
      return this.userCell.trap && this.user.invis <= 0;
    },
    async handleCellClick(cell) {
      let index = cell.index;
      const forceTrapInteraction = index !== this.user.cell && this.isTrapped();
      if (forceTrapInteraction) {
        index = this.user.cell;
      }

      try {
        const isRevealed = this.indexToCellIndex[index] !== undefined;
        if (!isRevealed && !forceTrapInteraction) {
          await this.estimateEnergy(index);
        } else {
          await this.interactWithCell(index, this.indexToCellIndex[index]);
        }
      } catch (e) {
        if (e === Erorrs.NoEnergy) {
          this.$app.$emit("shake-energy");
        }
      }
    },
    async movePlayerToCell(index) {
      const targetCell = this.getCellAt(this.indexToCellIndex[index]);
      const player = this.$refs.player;

      if (targetCell.trap && this.user.invis <= 0) {
        this.interactWithCell(index, this.indexToCellIndex[index]);
      }

      if (this.firstMove) {
        this.firstMove = false;
        player.snapToPosition(this.cellToScreen(targetCell));
        return;
      }

      await new Promise(resolve => {
        setTimeout(() => {
          if (this.user.cell == index) {
            player.moveToPosition(this.cellToScreen(targetCell));
          }
          resolve();
        }, 500);
      });
    },
    async interactWithCell(cellIndex, revealedIndex) {
      if (this.interaction) {
        return;
      }

      this.interaction = true;

      const cell = this.maze.revealed[revealedIndex];

      // Click to user's current cell
      try {
        if (cellIndex == this.user.cell) {
          let response = false;
          let responseType;
          let cmdResponse;

          if (cell.enemy) {
            response = await ShowEnemyPopup(cell.enemy.id, cell.enemy.health);
          } else if (cell.altar) {
            response = await ShowAltarPopup(cell.altar.id);
          } else if (cell.trap && this.user.invis <= 0) {
            response = await ShowTrapPopup(cell.trap.id);
          } else if (cell.loot) {
            response = await this.showPrompt(
              this.$t("loot-h"),
              this.$t("loot-t", { energy: 6 }),
              [
                {
                  type: "red",
                  title: this.$t("btn-cancel"),
                  response: false
                },
                {
                  type: "green",
                  title: this.$t("btn-ok"),
                  response: true
                }
              ]
            );
            responseType = "loot";
          } else if (cell.exit) {
            response = await ShowExitPopup();
            responseType = "exit";
          }

          if (!response) {
            return;
          }

          const currentItems = {
            scroll: this.user.scroll,
            potion: this.user.potion,
            key: this.user.key
          };

          if (response == "open") {
            // interact with the object in the cell
            cmdResponse = await this.performRequestNoCatch(
              this.$store.dispatch("dungeon/useItem", "key")
            );
          } else {
            // interact with the object in the cell
            cmdResponse = await this.performRequestNoCatch(
              this.$store.dispatch("dungeon/useCell", cellIndex)
            );
          }

          if (cmdResponse) {
            if (responseType == "loot") {
              console.log("Loot cmd response", cmdResponse, currentItems);

              for (const k in currentItems) {
                if (cmdResponse[k]) {
                  cmdResponse[k] -= currentItems[k];
                }
              }

              if (cmdResponse.items) {
                this.$app.logEvent("dungeon-items", {
                  items: cmdResponse.items
                });
              }

              await ShowLootReceivedPopup(cmdResponse);
              this.$store.commit("dungeon/updateLoot", cmdResponse);
            } else if (responseType == "exit") {
              this.$app.logEvent("dungeon-floor", { floor: this.maze.floor });
              this.$store.dispatch("dungeon/init", cmdResponse);
            }
          }
        } else {
          await this.estimateEnergy(cellIndex);
        }
      } finally {
        this.interaction = false;
      }
    },
    async handleAggressiveEnemy(payload) {
      await ShowEnemyPopup(payload.id, payload.health);
      this.$store.dispatch("dungeon/redirectToActiveCombat");
    },
    async handleJammedTrap(payload) {
      await ShowTrapJammed({
        trapId: payload.trap
      });
    },
    async confirmMovement(cell) {
      this.energyEstimation = {};
      this.highlightedCells = {};

      const cellIndex = cell.index;
      try {
        const isRevealed = this.indexToCellIndex[cellIndex] !== undefined;

        if (isRevealed) {
          await this.performRequestNoCatch(
            this.$store.dispatch("dungeon/moveToCell", cellIndex)
          );
        } else {
          await this.performRequestNoCatch(
            this.$store.dispatch("dungeon/revealCell", cellIndex)
          );
        }
      } catch (e) {
        if (e === Erorrs.NoEnergy) {
          this.$app.$emit("shake-energy");
        }
      }
    },
    async estimateEnergy(cellIndex) {
      this.energyEstimation = {};
      this.highlightedCells = {};

      const { energyRequired, path } = await this.performRequestNoCatch(
        this.$store.dispatch("dungeon/estimateEnergy", cellIndex)
      );
      if (path.length == 0) {
        this.$set(this.energyEstimation, cellIndex, energyRequired);
      } else {
        this.$set(this.energyEstimation, path[path.length - 1], energyRequired);
        for (const idx of path) {
          this.$set(this.highlightedCells, idx, true);
        }
      }
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

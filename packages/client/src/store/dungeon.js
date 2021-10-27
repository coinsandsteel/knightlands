import _ from "lodash";
import Events from "@/../../knightlands-shared/events";
import enemies from "@/metadata/halloween/dungeon_enemies.json";
import progression from "@/metadata/halloween/dungeon_progression.json";

import Operations from "@/../../knightlands-shared/operations";
import { CombatAction } from "@/../../knightlands-shared/dungeon_types";

const CombatOutcome = {
  EnemyWon: -1,
  PlayerWon: 1,
  NobodyWon: 0
};

const combatInitialState = {
  outcome: CombatOutcome.NobodyWon,
  enemyId: 0,
  enemyHealth: 0
};

export default {
  namespaced: true,
  state: {
    loaded: false,
    maze: {
      revealed: [],
      floor: 1,
      cycle: null,
      defuseFails: 0,
      width: 0,
      height: 0
    },
    user: {
      level: null,
      cell: null,
      energy: null,
      health: null,
      lastHpRegen: null,
      lastEnergyRegen: null,
      stats: {
        str: 0,
        dex: 0,
        int: 0,
        sta: 0
      },
      exp: 0,
      invis: 0
    },
    combat: _.clone(combatInitialState)
  },
  getters: {
    playerStats: state => {
      const stats = state.user.stats;
      return {
        maxHealth: Math.ceil(
          progression.baseHealth + 1.4 * stats.str + 1.15 * stats.sta
        ),
        defense: Math.ceil(
          progression.baseDefense + 1.5 * stats.dex + 1.25 * stats.sta
        ),
        attack: Math.ceil(
          progression.baseAttack + 1.5 * stats.str + 1.25 * stats.int
        ),
        maxEnergy: Math.ceil(
          progression.baseEnergy + 1.01 * stats.sta + (1.05 + stats.int)
        )
      };
    },

    nextExp: state => {
      return progression.experience[state.user.level - 1];
    },

    enemy: state => {
      if (!state.combat.enemyId) {
        return null;
      }
      return enemies[state.combat.enemyId];
    }
  },
  mutations: {
    useItem(state, item) {
      state.user[item]--;

      if (item == "potion") {
        state.user.invis += 10;
      }
    },
    updateInvisibility(state) {
      if (state.user.invis) {
        state.user.invis--;
      }
    },
    setInitialState(state, data) {
      if (data.user) {
        state.user = { ...state.user, ...data.user };
      }

      if (data.combat) {
        state.combat = data.combat;
      } else {
        state.combat = _.clone(combatInitialState);
      }

      delete data.user;
      delete data.combat;

      state.maze = { ...state.maze, ...data };
      state.loaded = true;
    },
    updateLoot(state, loot) {
      if (loot.potion) {
        state.user.potion = loot.potion;
      }

      if (loot.scroll) {
        state.user.scroll = loot.scroll;
      }

      if (loot.key) {
        state.user.key = loot.key;
      }

      if (loot.equip) {
        state.user.equip = loot.equip;
      }
    },
    updateState(state, data) {
      // cellRevealed
      if (data.cell) {
        console.log("New cell", data.cell);
        state.maze.revealed.push(...data.cell);
      }
      // energyChanged
      if (data.energy !== undefined) {
        console.log("User energy", data.energy);
        state.user.energy = data.energy;
      }
      // combatStarted
      if (data.combat !== undefined) {
        console.log("Combat status updated", data.combat);
        state.combat = { ...state.combat, ...data.combat };
      }
      // enemyHealth
      if (state.combat.enemyId && data.enemyHealth !== undefined) {
        console.log("Enemy HP", data.enemyHealth);
        state.combat.enemyHealth = data.enemyHealth;
      }
      // playerHealth
      if (data.playerHealth !== undefined) {
        console.log("Player HP", data.playerHealth);
        state.user.health = data.playerHealth;
      }
      // playerMoved
      if (data.moveTo !== undefined) {
        console.log("User moved to cell", data.moveTo);
        state.user.cell = data.moveTo;
      }

      if (data.enemy !== undefined) {
        state.maze.revealed[data.enemy.cell].enemy.health = data.enemy.health;
      }

      if (data.noEnemy !== undefined) {
        state.maze.revealed[data.noEnemy].enemy = undefined;
      }

      if (data.altar !== undefined) {
        console.log("Altar used", data.altar);
        state.maze.revealed[data.altar].altar = undefined;
      }

      if (data.trap !== undefined) {
        console.log("Trap used", data.trap);
        state.maze.revealed[data.trap].trap = undefined;
      }

      if (data.exp !== undefined) {
        console.log("User XP", data.exp);
        state.user.exp = data.exp;
      }

      if (data.level !== undefined) {
        console.log("Level changed", data.level);
        state.user.level = data.level;
      }

      if (data.loot !== undefined) {
        console.log("Loot received", data.loot);
        state.maze.revealed[data.loot].loot = undefined;
      }
    },
    resetCombat(state) {
      state.combat = _.clone(combatInitialState);
      console.log("Combat status was reset", state.combat);
    }
  },
  actions: {
    redirectToActiveCombat(store) {
      if (store.state.combat.enemyId) {
        this.$app.$router.push({ name: "dungeon-fight" });
      }
    },
    update(store, data) {
      store.commit("updateState", data);

      if (data.cell && data.cell.enemy) {
        let enemy = enemies[data.cell.enemy.id];
        if (enemy.isAgressiive) {
          console.log("Aggressive enemy encountered", enemy);
          this.$app.$emit("aggressive_enemy_encountered");
        }
      }

      if (data.combat) {
        store.dispatch("redirectToActiveCombat");
      }
    },
    subscribe(store) {
      this.$app.$game.onNetwork(Events.SDungeonUpdate, data => {
        store.dispatch("update", data);
      });
    },
    unsubscribe() {
      this.$app.$game.offNetwork(Events.SDungeonUpdate);
    },
    async load(store) {
      let result = await this.$app.$game._wrapOperation(
        Operations.SDungeonLoad
      );
      store.commit("setInitialState", result.response);
    },
    async revealCell(store, index) {
      await this.$app.$game._wrapOperation(Operations.SDungeonRevealCell, {
        cellId: index
      });
      store.commit("updateInvisibility");
    },
    async useCell(store, index) {
      const response = (
        await this.$app.$game._wrapOperation(Operations.SDungeonUseCell, {
          cellId: index
        })
      ).response;
      store.commit("updateInvisibility");
      return response;
    },
    async moveToCell(store, index) {
      await this.$app.$game._wrapOperation(Operations.SDungeonMove, {
        cellId: index
      });
      store.commit("updateInvisibility");
    },
    async combat(store, move) {
      await this.$app.$game._wrapOperation(Operations.SDunegonCombatAction, {
        action: CombatAction.Attack,
        data: { move }
      });
    },
    resetCombat(store) {
      store.commit("resetCombat");
    },
    async reset(store) {
      await this.$app.$game._wrapOperation(Operations.SDungeonGenerateNew);
      await store.dispatch("load");
    },
    async useItem(store, item) {
      await this.$app.$game._wrapOperation(Operations.SDungeonUseItem, {
        item
      });
      store.commit("useItem", item);
    }
  }
};

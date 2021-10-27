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
      exp: 0
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

    enemy: state => {
      if (!state.combat.enemyId) {
        return null;
      }
      return enemies[state.combat.enemyId];
    }
  },
  mutations: {
    setInitialState(state, data) {
      if (data.user) {
        state.user = data.user;
      }

      if (data.combat) {
        state.combat = data.combat;
      } else {
        state.combat = _.clone(combatInitialState);
      }

      state.maze = { ...state.maze, ...data };
      state.loaded = true;
    },
    updateState(state, data) {
      console.log("updateState", { data });

      // cellRevealed
      if (data.cell) {
        state.maze.revealed.push(...data.cell);
      }
      // energyChanged
      if (data.energy !== undefined) {
        state.user.energy = data.energy;
      }
      // combatStarted
      if (data.combat !== undefined) {
        state.combat = {...state.combat, ...data.combat};
      }
      // enemyHealth
      if (state.combat.enemyId && data.enemyHealth !== undefined) {
        state.combat.enemyHealth = data.enemyHealth;
      }
      // playerHealth
      if (data.playerHealth !== undefined) {
        state.user.health = data.playerHealth;
      }
      // playerMoved
      if (data.moveTo !== undefined) {
        state.user.cell = data.moveTo;
      }

      if (data.altar !== undefined) {
        state.maze.revealed[data.altar].altar = undefined;
      }

      if (data.trap !== undefined) {
        state.maze.revealed[data.trap].trap = undefined;
      }

      if (data.exp !== undefined) {
        state.user.exp = data.exp;
      }

      if (data.level !== undefined) {
        state.user.level = data.level;
      }

      if (data.loot !== undefined) {
        state.maze.revealed[data.loot].loot = undefined;
      }
    },
    resetCombat(state) {
      state.combat = _.clone(combatInitialState);
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
        console.log("Cell enemy", enemy);
        if (enemy.isAgressiive) {
          this.$app.$emit("aggressive_enemy_encountered");
        }
      }

      if (data.combat) {
        store.dispatch("redirectToActiveCombat");
      }

      // TODO combat finished > redirect to maze
      if (false) {
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
    },
    async useCell(store, index) {
      return (
        await this.$app.$game._wrapOperation(Operations.SDungeonUseCell, {
          cellId: index
        })
      ).response;
    },
    async moveToCell(store, index) {
      await this.$app.$game._wrapOperation(Operations.SDungeonMove, {
        cellId: index
      });
    },
    async combat(store, move) {
      await this.$app.$game._wrapOperation(Operations.SDunegonCombatAction, {
        action: CombatAction.Attack,
        data: { move }
      });
    },
    resetCombat(store) {
      store.commit('resetCombat');
    },
    async reset(store) {
      await this.$app.$game._wrapOperation(Operations.SDungeonGenerateNew);
      await store.dispatch("load");
    }
  }
};

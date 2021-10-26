import Events from "@/../../knightlands-shared/events";
import enemies from "@/metadata/halloween/dungeon_enemies.json";

import Operations from "@/../../knightlands-shared/operations";
import { CombatAction } from "@/../../knightlands-shared/dungeon_types";

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
      lastEnergyRegen: null
    },
    combat: {
      enemyId: 0,
      enemyHealth: 0
    }
  },
  getters: {
    enemy: state => {
      if (!state.combat || !state.combat.enemyId) {
        return null;
      }
      return enemies[state.combat.enemyId];
    }
  },
  mutations: {
    setInitialState(state, data) {
      if (data.user) {
        state.user = { ...state.user, ...data.user };
        delete data.user;
      }
      if (data.combat) {
        state.combat = data.combat;
      } else {
        state.combat.enemyId = 0;
        state.combat.enemyHealth = 0;
      }
      state.maze = { ...state.maze, ...data };
      state.loaded = true;
    },
    updateState(state, data) {
      // cellRevealed
      if (data.cell) {
        state.maze.revealed.push(data.cell);
      }
      // energyChanged
      if (data.energy !== undefined) {
        state.user.energy = data.energy;
      }
      // combatStarted
      if (data.combat) {
        state.combat = data.combat;
      }
      // enemyHealth
      if (data.enemyHealth !== undefined) {
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
    }
  },
  actions: {
    redirectToActiveCombat(store) {
      if (store.state.combat && store.state.combat.enemyId) {
        this.$app.$router.push({ name: "dungeon-fight" });
      }
    },
    subscribe(store) {
      this.$app.$game.onNetwork(Events.SDungeonUpdate, data => {
        store.commit("updateState", data);
      });
    },
    unsubscribe(store) {
      this.$app.$game.offNetwork(Events.SDungeonUpdate, data => {
        store.commit("updateState", data);
      });
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
      await this.$app.$game._wrapOperation(Operations.SDungeonUseCell, {
        cellId: index
      });
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
    async reset(store) {
      await this.$app.$game._wrapOperation(Operations.SDungeonGenerateNew);
      await store.dispatch("load");
    }
  }
};

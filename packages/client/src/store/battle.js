// import Vue from "vue";
// import * as battle from "@/../../knightlands-shared/battle";
import Events from "@/../../knightlands-shared/events";
// import Operations from "@/../../knightlands-shared/operations";

export default {
  namespaced: true,
  state: {
    loaded: false,

    // User
    balance: {
      energy: 0,
      coins: 0, // Source: PvE, Purpose: upgrade units level
      crystals: 0 // Source: PvP, Purpose: upgrade abilities level
    },
    timers: {
      energy: 0
    },
    rewards: {
      dailyRewards: [
        {
          collected: true,
          quantity: 1,
          active: true,
          date: "123"
        },
        {
          collected: false,
          quantity: 1,
          active: false
        }
      ],
      rankingRewards: [
        // Will be later
      ]
    },

    // Game
    room: 1, // 8
    difficulty: 0, // 0, 1
    level: 1, // 5 + 1 boss
    isMyTurn: false,
    squad: {
      power: 0,
      bonus: [
        { alias: "squad-increase-hp", delta: 2 }
      ]
    },

    // Map
    // Player and enemy units
    units: [
      {
        id: "2c8vny4t9",
        unitClass: "damager", // 5
        // exp > max limit > pay coins > lvl up > attributes auto-upgrade
        level: 1, // 15
        tier: 1, // 3, modify via merger (3 => 1)
        power: 5,
        index: 0, // 0-34
        exp: 100,
        attributes: {
          hp: 10,
          damage: 3,
          defence: 7,
          initiative: 1,
          speed: 4
        }
      }
    ],
    terrain: [
      { terrainClass: "forest-2", index: 4 }
    ],

    // Combat
    selectedUnitId: null,
    selectedEnemyId: null,
    moveCells: [0, 1, 2], // Choosed "move" action
    attackCells: [0, 1, 2], // Choosed ability
    abilities: [
      {
        unitId: "2c8vny4t9",
        abilityClass: "ability-1",
        // unit lvl opens ability lvl > pay crystal > lvl up
        level: 1, // 3-5
        power: {
          initial: 2,
          current: 3
        },
        cooldown: 0
      }
    ],
    buffs: [
      { unitId: "2c8vny4t9", abilityClass: "ability-1", buffClass: "increase-hp", delta: 2 }
    ]
  },
  getters: {
    isMyTurn(state) {
      return state.isMyTurn;
    },
    units(state) {
      return state.units;
    },
    selectedUnitId(state) {
      return state.selectedUnitId;
    },
    selectedUnit(state, getters) {
      if (!state.selectedUnitId) {
        return null;
      }

      return getters.units.find(({ id }) => id === getters.selectedUnitId);
    },
    availableMoves(state) {
      return state.availableMoves;
    },
    enemies(state) {
      return state.enemies;
    },
    selectedEnemyId(state) {
      return state.selectedEnemyId;
    },
    selectedEnemy(state, getters) {
      if (!state.selectedEnemyId) {
        return null;
      }

      return getters.enemies.find(({ id }) => id === getters.selectedEnemyId);
    },
    enemyAvailableMoves(state) {
      return state.enemyAvailableMoves;
    }
  },
  mutations: {
    updateState(state, data) {
      if (data.isMyTurn !== undefined) {
        state.isMyTurn = data.isMyTurn;
      }
      if (data.selectedUnitId !== undefined) {
        state.selectedUnitId = data.selectedUnitId;
      }
      if (data.units !== undefined) {
        state.units = data.units;
      }
      if (data.availableMoves !== undefined) {
        state.availableMoves = data.availableMoves;
      }
      if (data.selectedEnemyId !== undefined) {
        state.selectedEnemyId = data.selectedEnemyId;
      }
      if (data.enemies !== undefined) {
        state.enemies = data.enemies;
      }
      if (data.enemyAvailableMoves !== undefined) {
        state.enemyAvailableMoves = data.enemyAvailableMoves;
      }
    },
    setInitialState(state, data) {
      state.loaded = true;
    }
  },
  actions: {
    update(store, data) {
      store.commit("updateState", data);
    },
    subscribe(store) {
      this.$app.$game.onNetwork(Events.BattleUpdate, data => {
        store.dispatch("update", data);
      });
    },
    unsubscribe() {
      this.$app.$game.offNetwork(Events.BattleUpdate);
    }
  }
};

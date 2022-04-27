// import Vue from "vue";
// import * as battle from "@/../../knightlands-shared/battle";
import Events from "@/../../knightlands-shared/events";
// import Operations from "@/../../knightlands-shared/operations";

export default {
  namespaced: true,
  state: {
    loaded: false,

    isMyTurn: true,

    selectedUnitId: null,
    units: [
      { id: 6, index: 35 },
      { id: 7, index: 36 },
      { id: 8, index: 37 },
      { id: 9, index: 38 },
      { id: 10, index: 39 }
    ],
    availableMoves: [],

    selectedEnemyId: null,
    enemies: [
      { id: 1, index: 0 },
      { id: 2, index: 1 },
      { id: 3, index: 2 },
      { id: 4, index: 3 },
      { id: 5, index: 27 }
    ],
    enemyAvailableMoves: []
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
      if (data.selectedUnitId !== undefined) {
        state.selectedUnitId = data.selectedUnitId;
      }
      if (data.units !== undefined) {
        state.units = data.units;
      }
      if (data.availableMoves !== undefined) {
        state.availableMoves = data.availableMoves;
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

// import Vue from "vue";
// import * as battle from "@/../../knightlands-shared/battle";
import Events from "@/../../knightlands-shared/events";
// import Operations from "@/../../knightlands-shared/operations";

export default {
  namespaced: true,
  state: {
    loaded: false,
    selectedUnitId: null,
    phase: 1, // 1: select unit,
    units: [
      { id: 1, index: 0, isEnemy: true },
      { id: 2, index: 1, isEnemy: true },
      { id: 3, index: 2, isEnemy: true },
      { id: 4, index: 3, isEnemy: true },
      { id: 5, index: 27, isEnemy: true },
      { id: 6, index: 35, isEnemy: false },
      { id: 7, index: 36, isEnemy: false },
      { id: 8, index: 37, isEnemy: false },
      { id: 9, index: 38, isEnemy: false },
      { id: 10, index: 39, isEnemy: false }
    ],
    availableMoves: []
  },
  getters: {
    selectedUnitId(state) {
      return state.selectedUnitId;
    },
    selectedUnit(state) {
      if (!state.selectedUnitId) {
        return null;
      }

      return { id: state.selectedUnitId };
    },
    units(state) {
      return state.units;
    },
    availableMoves(state) {
      return state.availableMoves;
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

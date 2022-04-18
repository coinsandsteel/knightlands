// import Vue from "vue";
// import * as battle from "@/../../knightlands-shared/battle";
import Events from "@/../../knightlands-shared/events";
// import Operations from "@/../../knightlands-shared/operations";

export default {
  namespaced: true,
  state: {
    loaded: false
  },
  getters: {},
  mutations: {
    updateState(state, data) {},
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

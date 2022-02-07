import Vue from "vue";
import UiConstants from "@/ui_constants";

export default {
  namespaced: true,
  state: {
    currentRaids: []
  },
  getters: {
    currentActiveRaids: state =>
      state.currentRaids.slice(0, UiConstants.maxActiveRaids),
    canSummonCurrentRaid: (state, getters) =>
      getters.currentActiveRaids.length < UiConstants.maxActiveRaids
  },
  mutations: {
    updateState(state, data) {
      if (data.currentRaids !== undefined) {
        state.currentRaids = data.currentRaids;
      }
    }
  },
  actions: {
    async fetchCurrentRaids(store) {
      const raids = await Vue.prototype.$game
        .fetchCurrentRaids()
        .catch(() => []);
      store.commit("updateState", { currentRaids: raids });

      return raids;
    }
  }
};

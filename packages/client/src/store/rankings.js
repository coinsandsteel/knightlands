import Vue from "vue";

export default {
  namespaced: true,
  state: {
    currentRace: null
  },
  mutations: {
    setCurrentRace(state, { currentRace }) {
      state.currentRace = currentRace;
    }
  },
  actions: {
    async update(context) {
      const info = await Vue.prototype.$game.fetchRaces();
      if (info) {
        context.commit("setCurrentRace", { currentRace: info.currentRace });
      }
    }
  }
};

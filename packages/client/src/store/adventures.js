import Vue from "vue";

export default {
  namespaced: true,
  state: {
    readyToCollect: false
  },
  mutations: {
    setAll(state, { readyToCollect }) {
      state.readyToCollect = readyToCollect;
    }
  },
  actions: {
    async update({ commit }) {
      let adventures = (await Vue.prototype.$game.fetchAdventuresStatus())
        .adventures;

      let i = 0;
      let readyToCollect = false;
      const l = adventures.length;
      for (i; i < l; ++i) {
        const adventure = adventures[i];
        if (
          adventure.startTime > 0 &&
          adventure.duration -
            (Vue.prototype.$game.now - adventure.startTime) / 1000 <=
            0
        ) {
          readyToCollect = true;
          break;
        }
      }

      commit("setAll", {
        readyToCollect: readyToCollect
      });
    }
  }
};

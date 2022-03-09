// import * as april from "@/../../knightlands-shared/april";

import Events from "@/../../knightlands-shared/events";
import Operations from "@/../../knightlands-shared/operations";

export default {
  namespaced: true,
  state: {
    loaded: true,
    // User
    balance: {
      sessionGold: 0,
      gold: 0
    },
    selectedHeroIndex: 0,
    dailyRewards: [],
    // Playground
    stat: {
      points: 0
    },
    sequence: null
  },
  getters: {
    heroes() {
      return [];
    },
    selectedHero(state, getters) {
      return getters.heroes ? getters.heroes[state.selectedHeroIndex] : null;
    }
  },
  mutations: {
    updateState(state, data) {
      // if (data.balance !== undefined) {
      //   state.balance = { ...state.balance, ...data.balance };
      // }
    },
    setInitialState(state, data) {
      state.loaded = true;
      // state.balance = data.user.balance;
    },
    setHeroIndex(state, value) {
      state.selectedHeroIndex = value;
    }
  },
  actions: {
    async load(store) {
      let result = await this.$app.$game._wrapOperation(Operations.AprilLoad);
      store.commit("setInitialState", result.response);
    },
    update(store, data) {
      store.commit("updateState", data);
    },
    subscribe(store) {
      this.$app.$game.onNetwork(Events.AprilUpdate, data => {
        store.dispatch("update", data);
      });
    },
    unsubscribe() {
      this.$app.$game.offNetwork(Events.AprilUpdate);
    },
    async claimRewards() {
      return (
        await this.$app.$game._wrapOperation(Operations.AprilClaimRewards)
      ).response;
    },
    increasePetIndex({ state, commit, getters }) {
      const newIndex = (state.selectedPetIndex + 1) % getters.pets.length;
      commit("setPetIndex", newIndex);
    },
    decreasePetIndex({ state, commit, getters }) {
      const newIndex =
        (state.selectedPetIndex - 1 < 0
          ? getters.pets.length - 1
          : state.selectedPetIndex - 1) % getters.pets.length;
      commit("setPetIndex", newIndex);
    },
    async rankings() {
      return (await this.$app.$game._wrapOperation(Operations.AprilRanking))
        .response;
    }
  }
};

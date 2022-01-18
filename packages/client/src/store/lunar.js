// import _ from "lodash";
import Events from "@/../../knightlands-shared/events";
import Operations from "@/../../knightlands-shared/operations";

export default {
  namespaced: true,
  state: {
    loaded: false,
    newItem: {},
    dailyRewards: [],
    currentDailyReward: []
  },
  getters: {
    currentDailyReward: state => day => {
      return state.dailyRewards[day].items;
    }
  },
  mutations: {
    updateState(state, data) {
      if (data.items !== undefined) {
        state.items = data.items;
      }
      if (data.newItem !== undefined) {
        state.newItem = data.newItem;
      }
      if (data.dailyRewards !== undefined) {
        state.dailyRewards = data.dailyRewards;
      }
    },
    setInitialState(state, data) {
      // eslint-disable-next-line no-console
      console.log("setInitialState", data);
      state.items = data.items;
      state.loaded = true;
      state.dailyRewards = data.dailyRewards;
    }
  },
  actions: {
    async testAction(store, payload) {
      await this.$app.$game._wrapOperation(Operations.LunarTestAction, payload);
    },
    async load(store) {
      let result = await this.$app.$game._wrapOperation(Operations.LunarLoad);
      store.commit("setInitialState", result.response);
    },
    async craft(store, items) {
      await this.$app.$game._wrapOperation(Operations.LunarCraft, items);
    },
    async exchange(store, items) {
      await this.$app.$game._wrapOperation(Operations.LunarExchange, items);
    },
    collectDailyReward() {
      this.$app.$game._wrapOperation(Operations.LunarCollectDailyReward);
    },
    update(store, data) {
      store.commit("updateState", data);
    },
    subscribe(store) {
      this.$app.$game.onNetwork(Events.LunarUpdate, data => {
        store.dispatch("update", data);
      });
    },
    unsubscribe() {
      this.$app.$game.offNetwork(Events.LunarUpdate);
    }
  }
};

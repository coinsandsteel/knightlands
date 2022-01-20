// import _ from "lodash";
import Events from "@/../../knightlands-shared/events";
import Operations from "@/../../knightlands-shared/operations";

export default {
  namespaced: true,
  state: {
    loaded: false,
    newItem: null,
    dailyRewards: [],
    usedRecipes: []
  },
  mutations: {
    updateState(state, data) {
      // eslint-disable-next-line no-console
      console.log("lunar updateState", data);
      if (data.usedRecipes !== undefined) {
        state.usedRecipes = data.usedRecipes;
      }
      if (data.newItem !== undefined) {
        state.newItem = data.newItem;
      }
      if (data.dailyRewards !== undefined) {
        state.dailyRewards = data.dailyRewards;
        this.$app.$emit("lunar-show-daily-reward");
      }
    },
    setInitialState(state, data) {
      // eslint-disable-next-line no-console
      console.log("setInitialState", data);
      state.items = data.items;
      state.loaded = true;
      state.dailyRewards = data.dailyRewards;
      state.usedRecipes = data.usedRecipes;
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

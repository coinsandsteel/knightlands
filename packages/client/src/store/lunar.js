import Events from "@/../../knightlands-shared/events";
import Operations from "@/../../knightlands-shared/operations";

export default {
  namespaced: true,
  state: {
    loaded: false,
    newItem: null,
    dailyRewards: [],
    usedRecipes: [],
    craftingElementsFromRecipe: [],
    hasNewRecipe: false
  },
  mutations: {
    updateState(state, data) {
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
      if (data.craftingElementsFromRecipe !== undefined) {
        state.craftingElementsFromRecipe = data.craftingElementsFromRecipe;
      }
      if (data.hasNewRecipe !== undefined) {
        state.hasNewRecipe = data.hasNewRecipe;
      }
    },
    setInitialState(state, data) {
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
      return (
        await this.$app.$game._wrapOperation(Operations.LunarCraft, items)
      ).response;
    },
    async exchange(store, items) {
      await this.$app.$game._wrapOperation(Operations.LunarExchange, items);
    },
    async purchase(store, payload) {
      return (
        await this.$app.$game._wrapOperation(Operations.LunarPurchase, payload)
      ).response;
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
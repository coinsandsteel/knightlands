import _ from "lodash";
import Events from "@/../../knightlands-shared/events";
import Operations from "@/../../knightlands-shared/operations";

export default {
  namespaced: true,
  state: {
    loaded: false,
    items: [],
    newItem: {},
    dailyRewards: [
      /*{ collected: true, active: false, quantity: 3 },
      { collected: true, active: false, quantity: 3 },
      { collected: true, active: false, quantity: 3 },
      { collected: true, active: false, quantity: 3 },
      { collected: false, active: true, quantity: 3 }*/
    ],
    currentDailyReward: [
      /*{
        id: 1,
        template: 100,
        rarity: "common",
        caption: "l111",
        quantity: 2
      }*/
    ]
  },
  getters: {},
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
      if (data.currentDailyReward !== undefined) {
        state.currentDailyReward = data.currentDailyReward;
      }
    },
    setInitialState(state, data) {
      state.items = data.items;
      state.loaded = true;
    }
  },
  actions: {
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
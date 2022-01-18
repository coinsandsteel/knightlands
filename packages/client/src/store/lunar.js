// import _ from "lodash";
import Events from "@/../../knightlands-shared/events";
import Operations from "@/../../knightlands-shared/operations";
import store from "../store";

export default {
  namespaced: true,
  state: {
    loaded: false,
    items: [],
    newItem: {},
    dailyRewards: [],
    currentDailyReward: []
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
      // eslint-disable-next-line no-console
      console.log("setInitialState", data);
      state.items = data.items;
      state.loaded = true;

      state.dailyRewards = [
        { collected: true, active: false, quantity: 3 },
        { collected: true, active: false, quantity: 4 },
        { collected: true, active: false, quantity: 6 },
        { collected: true, active: false, quantity: 2 },
        { collected: false, active: true, quantity: 7 },
        { collected: false, active: false, quantity: 3 },
        { collected: false, active: false, quantity: 8 }
      ];

      store.currentDailyReward = [
        {
          id: 1,
          template: 100,
          rarity: "common",
          caption: "l111",
          quantity: 2
        },
        {
          id: 2,
          template: 100,
          rarity: "common",
          caption: "l111",
          quantity: 5
        },
        {
          id: 3,
          template: 100,
          rarity: "common",
          caption: "l111",
          quantity: 5
        },
        {
          id: 4,
          template: 100,
          rarity: "common",
          caption: "l111",
          quantity: 3
        }
      ];
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

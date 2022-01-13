import _ from "lodash";

import {
  ITEM_CATEGORY_BASIC,
  ITEM_CATEGORY_ADVANCED,
  ITEM_CATEGORY_EXPERT
} from "@/../../knightlands-shared/lunar";

import Events from "@/../../knightlands-shared/events";
import Operations from "@/../../knightlands-shared/operations";

export default {
  namespaced: true,
  state: {
    loaded: false,
    itemCategory: ITEM_CATEGORY_BASIC,
    inventory: [],
    newElement: null
  },
  getters: {},
  mutations: {
    updateState(state, data) {},
    updateCategory(state, value) {
      state.itemCategory = value;
    },
    setInitialState(state, data) {
      state.inventory = data.inventory;
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
    },
    updateItemCategory(store, value) {
      store.commit("updateItemCategory", value);
    }
  }
};

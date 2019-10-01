import Vue from "vue";
import Vuex from "vuex";
import VuexPersist from "vuex-persist";

Vue.use(Vuex);

const vuexPersist = new VuexPersist({
  key: "knightlands",
  storage: localStorage
})

import {
  EquipmentSlots
} from "@/../knightlands-shared/equipment_slot";

import ItemType from "@/../knightlands-shared/item_type";
import Blockchains from "@/../knightlands-shared/blockchains";
const Rarity = require("@/../knightlands-shared/rarity");

let filters = {
  ...ItemType,
  ...EquipmentSlots
};

let defaultFilters = {};
for (let i in filters) {
  defaultFilters[filters[i]] = true;
}

// equipment is expanded with equipment slots instead
delete filters.Equipment;

const FiltersVersion = 3;

const store = new Vuex.Store({
  state: {
    itemFiltersVersion: 0,
    selectedQuestZone: undefined,
    itemFilters: defaultFilters,
    zoneStage: 0,
    blockchain: Blockchains.Tron,
    craftingListOptions: {},
    recipeFilters: {}
  },
  mutations: {
    setQuestZone(state, zoneId) {
      state.selectedQuestZone = zoneId;
    },
    setItemFilters(state, filters) {
      for (let i in filters) {
        Vue.set(state.itemFilters, i, filters[i]);
      }
    },
    setZoneStage(state, args) {
      state.zoneStage = args.stage;
    },
    setAvailableSwitchInCraftingList(state, args) {
      let options = state.craftingListOptions[args.listId] || {};
      options.availableSwitch = args.value;
      Vue.set(state.craftingListOptions, args.listId, options);
    },
    setRecipeFilters(state, args) {
      Vue.set(state.recipeFilters, args.id, args.filters);
    }
  },
  getters: {
    getAvailableSwitchInCraftingList: state => listId => {
      return !!(state.craftingListOptions[listId] || {}).availableSwitch;
    },
    selectedQuestZone: state => {
      return state.selectedQuestZone;
    },
    getItemFilters: state => {
      if (state.itemFiltersVersion != FiltersVersion) {
        state.itemFiltersVersion = FiltersVersion;
        state.itemFilters = defaultFilters;
      }
      return state.itemFilters;
    },
    getZoneStage: state  => {
      return state.zoneStage;
    },
    getRecipeFilters: state => id => {
      let filters = state.recipeFilters[id];
      if (!filters || !filters.rarity) {
        filters = {
          rarity: {}
        };

        for (let i in Rarity) {
          filters.rarity[Rarity[i]] = true;
        }

        state.recipeFilters[id] = filters;
      }

      return filters;
    }
  },
  plugins: [vuexPersist.plugin],
  strict: false
});

export default store;
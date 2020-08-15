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
} from "@/../../knightlands-shared/equipment_slot";

import ItemType from "@/../../knightlands-shared/item_type";
import Blockchains from "@/../../knightlands-shared/blockchains";
const Rarity = require("@/../../knightlands-shared/rarity");

let filters = {
  ...ItemType,
  ...EquipmentSlots
};

const defaultFilters = {};
for (let i in filters) {
  if (i == "Equipment") {
    // equipment is expanded with equipment slots instead
    continue;
  }
  defaultFilters[filters[i]] = true;
}

const defaultUnitFilters = {};
for (let i = 1; i <= 10; ++i) {
  defaultUnitFilters[i] = true;
}

const FiltersVersion = 6;

const store = new Vuex.Store({
  state: {
    itemFiltersVersion: 0,
    unitFiltersVersion: 0,
    selectedQuestZone: undefined,
    itemFilters: defaultFilters,
    unitFilters: defaultUnitFilters,
    disenchantFilters: defaultFilters,
    zoneStage: 0,
    blockchain: Blockchains.Tron,
    craftingListOptions: {},
    recipeFilters: {},
    selectedLegion: 0
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
    setUnitFilters(state, filters) {
      for (let i in filters) {
        Vue.set(state.unitFilters, i, filters[i]);
      }
    },
    setDisenchantingFilters(state, filters) {
      for (let i in filters) {
        Vue.set(state.disenchantFilters, i, filters[i]);
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
    },
    setSelectedLegion(state, legionIndex) {
      state.selectedLegion = legionIndex;
    }
  },
  getters: {
    selectedLegion: state => {
      return state.selectedLegion + 1;
    },
    disenchantFilters: state => {
      if (state.itemFiltersVersion != FiltersVersion) {
        state.itemFiltersVersion = FiltersVersion;
        state.itemFilters = defaultFilters;
      }
      return state.disenchantFilters;
    },
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
    getUnitFilters: state => {
      if (state.unitFiltersVersion != FiltersVersion) {
        state.unitFiltersVersion = FiltersVersion;
        state.unitFilters = defaultUnitFilters;
      }
      return state.unitFilters;
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

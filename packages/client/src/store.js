/*jshint esversion: 9 */

import Vue from "vue";
import Vuex from "vuex";
import VuexPersist from "vuex-persist";

Vue.use(Vuex);

const vuexPersist = new VuexPersist({
  key: "knightlands",
  storage: localStorage
});

import { EquipmentSlots } from "@/../../knightlands-shared/equipment_slot";

import ItemType from "@/../../knightlands-shared/item_type";
import Blockchains from "@/../../knightlands-shared/blockchains";
const Rarity = require("@/../../knightlands-shared/rarity");

const equipmentDefaultFilters = {};
for (let i in EquipmentSlots) {
  equipmentDefaultFilters[EquipmentSlots[i]] = true;
}

const defaultUnitFilters = {};
// 10 stars maximum
for (let i = 1; i <= 10; ++i) {
  defaultUnitFilters[i] = true;
}

const FiltersVersion = 7;

const store = new Vuex.Store({
  state: {
    itemFiltersVersion: 0,
    unitFiltersVersion: 0,
    selectedQuestZone: undefined,
    equipmentFilters: equipmentDefaultFilters,
    unitFilters: defaultUnitFilters,
    disenchantFilters: equipmentDefaultFilters,
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
    setEquipmentFilters(state, filters) {
      for (let i in filters) {
        Vue.set(state.equipmentFilters, i, filters[i]);
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
        state.itemFilters = equipmentDefaultFilters;
      }
      return state.disenchantFilters;
    },
    getAvailableSwitchInCraftingList: state => listId => {
      return !!(state.craftingListOptions[listId] || {}).availableSwitch;
    },
    selectedQuestZone: state => {
      return state.selectedQuestZone;
    },
    getEquipmentFilters: state => {
      if (state.itemFiltersVersion != FiltersVersion) {
        state.itemFiltersVersion = FiltersVersion;
        state.equipmentFilters = equipmentDefaultFilters;
      }
      return state.equipmentFilters;
    },
    getUnitFilters: state => {
      if (state.unitFiltersVersion != FiltersVersion) {
        state.unitFiltersVersion = FiltersVersion;
        state.unitFilters = defaultUnitFilters;
      }
      return state.unitFilters;
    },
    getZoneStage: state => {
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

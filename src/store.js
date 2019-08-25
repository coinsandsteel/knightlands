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

const store = new Vuex.Store({
  state: {
    selectedQuestZone: undefined,
    itemFilters: {},
    zoneStages: {},
    blockchain: Blockchains.Tron
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
      Vue.set(state.zoneStages, args.zone, args.stage);
    }
  },
  getters: {
    selectedQuestZone: state => {
      return state.selectedQuestZone;
    },
    itemFilters: state => {
      let filters = {
        ...ItemType,
        ...EquipmentSlots
      };

      // equipment is expanded with equipment slots instead
      delete filters.Equipment;

      let itemFilters = state.itemFilters;

      if (Object.keys(state.itemFilters).length !== Object.keys(filters).length) {
        itemFilters = {};
        for (let i in filters) {
          itemFilters[filters[i]] = true;
        }
      }
      return itemFilters;
    },
    getZoneStage: state => zone => {
      return state.zoneStages[zone] === undefined ? 0 : state.zoneStages[zone];
    }
  },
  plugins: [vuexPersist.plugin],
  strict: process.env.NODE_ENV !== 'production'
});

export default store;
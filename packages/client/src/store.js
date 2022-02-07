/*jshint esversion: 9 */

import _ from "lodash";
import Vue from "vue";
import Vuex from "vuex";
import VuexPersist from "vuex-persist";
import { EquipmentSlots } from "@/../../knightlands-shared/equipment_slot";

import ItemType from "@/../../knightlands-shared/item_type";
import Blockchains from "@/../../knightlands-shared/blockchains";
const Rarity = require("@/../../knightlands-shared/rarity");
import EquipmentType from "@/../../knightlands-shared/equipment_type";

import DailyLoginStore from "@/store/dailyLogin";
import Adventures from "@/store/adventures";
import Rankings from "@/store/rankings";
import Summon from "@/store/summon";
import Training from "@/store/training";
import Tutorial from "@/store/tutorial";
import Shop from "@/store/shop";
import Settings from "@/store/settings";
import Dungeon from "@/store/dungeon";
import Xmas from "@/store/xmas";
import Lunar from "@/store/lunar";
import March from "@/store/march";
import Elements from "@/../../knightlands-shared/elements";
import ArmyUnitTypes from "@/army_unit_types";

Vue.use(Vuex);

const vuexPersist = new VuexPersist({
  key: "knightlands",
  storage: localStorage,
  reducer: (state) => _.omit(state, ['dungeon', 'xmas', 'lunar', 'march'])
});

const DefaultRarityFilters = {};
for (let i in Rarity) {
  DefaultRarityFilters[Rarity[i]] = true;
}

const equipmentDefaultFilters = {};
for (let i in EquipmentSlots) {
  equipmentDefaultFilters[EquipmentSlots[i]] = true;
}

const miscDefaultFilters = {};
for (let i in ItemType) {
  if (i == "Equipment") {
    continue;
  }
  miscDefaultFilters[ItemType[i]] = true;
}

const defaultUnitFilters = {
  star: {},
  element: {},
  type: {},
  weapon: {
    [EquipmentType.Axe]: true,
    [EquipmentType.Bow]: true,
    [EquipmentType.Spear]: true,
    [EquipmentType.Sword]: true,
    [EquipmentType.Wand]: true
  }
};
{
  // 10 stars maximum
  for (let i = 1; i <= 10; ++i) {
    defaultUnitFilters.star[i] = true;
  }

  for (let k in Elements) {
    defaultUnitFilters.element[Elements[k]] = true;
  }

  for (let k in ArmyUnitTypes) {
    defaultUnitFilters.type[k] = true;
  }
}

const weaponDefaultFilters = {
  [EquipmentType.Axe]: true,
  [EquipmentType.Bow]: true,
  [EquipmentType.Spear]: true,
  [EquipmentType.Sword]: true,
  [EquipmentType.Wand]: true,
  [EquipmentType.Shield]: true,
  [EquipmentType.Star]: true,
  [EquipmentType.Knive]: true,
  [EquipmentType.Scythe]: true,
  [EquipmentType.Whip]: true
};

const FiltersVersion = 12;

const store = new Vuex.Store({
  state: {
    itemFiltersVersion: 0,
    unitFiltersVersion: 0,
    miscFiltersVersion: 0,
    selectedQuestZone: undefined,
    equipmentFilters: equipmentDefaultFilters,
    miscFilters: miscDefaultFilters,
    unitFilters: defaultUnitFilters,
    disenchantFilters: equipmentDefaultFilters,
    enchantFilters: equipmentDefaultFilters,
    unbindFilters: equipmentDefaultFilters,
    levelUpFilters: equipmentDefaultFilters,
    evolveOtherFilters: equipmentDefaultFilters,
    evolveWeaponFilters: weaponDefaultFilters,
    evolveToggleState: true,
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
    setMiscFilters(state, filters) {
      for (let i in filters) {
        Vue.set(state.miscFilters, i, filters[i]);
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
    setEnchantingFilters(state, filters) {
      for (let i in filters) {
        Vue.set(state.enchantFilters, i, filters[i]);
      }
    },
    setUnbindFilters(state, filters) {
      for (let i in filters) {
        Vue.set(state.unbindFilters, i, filters[i]);
      }
    },
    setLevelUpFilters(state, filters) {
      for (let i in filters) {
        Vue.set(state.levelUpFilters, i, filters[i]);
      }
    },
    setEvolveOtherFilters(state, filters) {
      for (let i in filters) {
        Vue.set(state.evolveOtherFilters, i, filters[i]);
      }
    },
    setEvolveWeaponFilters(state, filters) {
      for (let i in filters) {
        Vue.set(state.evolveWeaponFilters, i, filters[i]);
      }
    },
    setEvolveToggle(state, value) {
      state.evolveToggleState = value;
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
    getDisenchantFilters: state => {
      if (state.itemFiltersVersion != FiltersVersion) {
        state.itemFiltersVersion = FiltersVersion;
        state.disenchantFilters = equipmentDefaultFilters;
      }
      return state.disenchantFilters;
    },
    getEnchantFilters: state => {
      if (state.itemFiltersVersion != FiltersVersion) {
        state.itemFiltersVersion = FiltersVersion;
        state.enchantFilters = equipmentDefaultFilters;
      }
      return state.enchantFilters;
    },
    getEvolveToggle: state => {
      return state.evolveToggleState;
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
    getMiscFilters: state => {
      if (state.miscFiltersVersion != FiltersVersion) {
        state.miscFiltersVersion = FiltersVersion;
        state.miscFilters = miscDefaultFilters;
      }
      return state.miscFilters;
    },
    getUnitFilters: state => {
      if (state.unitFiltersVersion != FiltersVersion) {
        state.unitFiltersVersion = FiltersVersion;
        state.unitFilters = defaultUnitFilters;
      }
      return state.unitFilters;
    },
    getUnbindFilters: state => {
      if (state.unitFiltersVersion != FiltersVersion) {
        state.unitFiltersVersion = FiltersVersion;
        state.unbindFilters = equipmentDefaultFilters;
      }
      return state.unbindFilters;
    },
    getLevelUpFilters: state => {
      if (state.unitFiltersVersion != FiltersVersion) {
        state.unitFiltersVersion = FiltersVersion;
        state.unitFilters = equipmentDefaultFilters;
      }
      return state.levelUpFilters;
    },
    getEvolveOtherFilters: state => {
      if (state.unitFiltersVersion != FiltersVersion) {
        state.unitFiltersVersion = FiltersVersion;
        state.evolveOtherFilters = equipmentDefaultFilters;
      }
      return state.evolveOtherFilters;
    },
    getEvolveWeaponFilters: state => {
      if (state.unitFiltersVersion != FiltersVersion) {
        state.unitFiltersVersion = FiltersVersion;
        state.evolveWeaponFilters = weaponDefaultFilters;
      }
      return state.evolveWeaponFilters;
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
  strict: false,
  modules: {
    dailyLogin: DailyLoginStore,
    adventures: Adventures,
    rankings: Rankings,
    summon: Summon,
    training: Training,
    tutorial: Tutorial,
    settings: Settings,
    shop: Shop,
    dungeon: Dungeon,
    xmas: Xmas,
    lunar: Lunar,
    march: March
  }
});

store.subscribe((mutation, state) => {
  if (
    !mutation.type.includes('training')
    &&
    !mutation.type.includes('tutorial')
  ) {
    console.log('Mutation', mutation.type, mutation.payload);
  }
});

store.subscribeAction((action, state) => {
  if (
    !action.type.includes('training')
    &&
    !action.type.includes('tutorial')
  ) {
    console.log('Action', action.type, action.payload);
  }
});

export default store;

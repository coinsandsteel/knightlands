import _ from "lodash";
import Events from "@/../../knightlands-shared/events";
import {
  currencies,
  getTowerLevelBoundaries,
  getMainTowerPerkValue,
  farmConfig,
  getFarmTimeData,
  getFarmIncomeData,
  getFarmUpgradeData,
  TOWER_PERK_SPEED,
  TOWER_PERK_BOOST,
  TOWER_PERK_SUPER_SPEED,
  TOWER_PERK_SUPER_BOOST,
  TOWER_PERK_AUTOCYCLES_COUNT,
  TOWER_PERK_CYCLE_DURATION,
  TOWER_PERK_INCOME,
  TOWER_PERK_UPGRADE
} from "../../../knightlands-shared/xmas";

import Operations from "@/../../knightlands-shared/operations";
import timer from "../timer";
import Vue from "vue";

const slots = {};
const initialSlotState = {
  level: 0,
  autoCyclesLeft: 0,
  previousCurrencyIncome: null
};
for (let i = 1; i <= 9; i++) {
  slots[i] = _.clone(initialSlotState);
}

const initialPerksBranchesState = {};
const initialPerksState = {};
const initialPerkState = {
  [TOWER_PERK_CYCLE_DURATION]: { level: 0 },
  [TOWER_PERK_INCOME]: { level: 0 },
  [TOWER_PERK_UPGRADE]: { level: 0 },
  [TOWER_PERK_AUTOCYCLES_COUNT]: { level: 0 },
  [TOWER_PERK_BOOST]: { level: 0 },
  [TOWER_PERK_SPEED]: { level: 0 },
  [TOWER_PERK_SUPER_BOOST]: { level: 0 },
  [TOWER_PERK_SUPER_SPEED]: { level: 0 }
};
currencies.forEach(currency => {
  initialPerksBranchesState[currency] = false;
  initialPerksState[currency] = _.clone(initialPerkState);
});

export default {
  namespaced: true,
  state: {
    loaded: true,
    mode: "manage",
    area: {},
    user: {},
    towerLevelBoundaries: null,
    tower: {
      expirience: 100,
      level: 1,
      currentLevelPercentage: 0
    },
    levelGap: 1,
    slots,
    perks: initialPerksState,
    perkBranches: initialPerksBranchesState,
    flags: {
      perks: false
    }
  },
  getters: {
    slot: (state, getters) => tier => {
      return {
        ...state.slots[tier],
        cycleLength: getters.cycleLength(tier),
        upgradePrice: getters.upgradePrice(tier),
        incomeValue: getters.incomeValue(tier),
        currency: farmConfig[tier].currency
      };
    },
    upgradePrice: state => tier => {
      let levelGap = 1;
      let level = state.slots[tier].level;
      if (level > 0) {
        levelGap = state.levelGap === Infinity ?
          100 :
          state.levelGap;
      }
      let stat = getFarmUpgradeData(tier, level + levelGap, {
        upgradePerkLevel: 1
      });
      return stat.upgradePrice;
    },
    incomeValue: state => tier => {
      let level = state.slots[tier].level;
      let stat = getFarmIncomeData(tier, level, {
        incomePerkLevel: 1,
        cycleDurationPerkLevel: 1,
        [TOWER_PERK_BOOST]: false,
        [TOWER_PERK_SUPER_BOOST]: false
      });
      return stat;
    },
    cycleLength: () => tier => {
      let stat = getFarmTimeData(tier, {
        cycleDurationPerkLevel: 1,
        [TOWER_PERK_SPEED]: false,
        [TOWER_PERK_SUPER_SPEED]: false
      });
      return stat.cycleLength;
    },
    playerStats: state => nextStats => {
      return {};
    },
    perkData: state => (tier, perkName) => {
      return state.perks[farmConfig[tier].currency][perkName];
    }
  },
  mutations: {
    updateState(state, data) {},
    resetArea(state) {
      //state.area = _.clone(areaInitialState);
      console.log("Area was reset", state.area);
    },
    updateSlot(state, {
      tier,
      data
    }) {
      state.slots[tier] = {
        ...state.slots[tier],
        ...data
      };
    },
    updateMode(state, value) {
      state.mode = value;
    },
    updateLevelGap(state, value) {
      state.levelGap = value;
    },
    addExpirience(state, value) {
      state.tower.expirience += value;

      let currentExp = state.tower.expirience;
      let currentLevel = state.tower.level;
      let newLevel = currentLevel + 1;
      let currentLevelExpStart = state.towerLevelBoundaries[currentLevel];
      let currentLevelExpEnd = state.towerLevelBoundaries[newLevel];

      while (state.towerLevelBoundaries[newLevel] < state.tower.expirience) {
        currentLevelExpStart = state.towerLevelBoundaries[newLevel];
        currentLevelExpEnd = state.towerLevelBoundaries[newLevel + 1];
        newLevel++;
      }

      if (newLevel > currentLevel) {
        state.tower.level = newLevel - 1;
      }

      let expGap = currentLevelExpEnd - currentLevelExpStart;
      let currentGap = currentExp - currentLevelExpStart;

      state.tower.currentLevelPercentage = Math.floor(
        currentGap * 100 / expGap
      );
    },
    setTowerLevelBoundaries(state) {
      state.towerLevelBoundaries = getTowerLevelBoundaries();
    },
    decreaseAutoCycleCount(state, tier) {
      if (state.slots[tier].autoCyclesLeft > 0) {
        state.slots[tier].autoCyclesLeft--;
      }
    },
    toggleFlag(state, key) {
      state.flags[key] = !state.flags[key];
    },
    commitPerks(state, perks) {
      for (let currencyName in perks) {
        for (let perkName in perks[currencyName]) {
          state.perks[currencyName][perkName].level =
          perks[currencyName][perkName].level;
        }
      }
    }
  },
  actions: {
    commitPerks(store, perks) {
      store.commit('commitPerks', perks);
    },
    setInitialState(store) {
      store.dispatch("setTowerLevelBoundaries");
    },
    setTowerLevelBoundaries(store) {
      store.commit('setTowerLevelBoundaries');
    },
    cycleFinished(store, tier) {
      store.dispatch('resetIncomeValue', tier);
      store.commit('decreaseAutoCycleCount', tier);
    },
    epochFinished(store, tier) {
      let perkData = store.getters.perkData(tier, TOWER_PERK_AUTOCYCLES_COUNT);
      let autoCyclesLeft = getMainTowerPerkValue(tier, TOWER_PERK_AUTOCYCLES_COUNT, perkData.level);
      store.commit('updateSlot', {
        tier,
        data: { autoCyclesLeft }
      });
    },
    addExpirience(store, value) {
      store.commit('addExpirience', value);
    },
    updateLevelGap(store, value) {
      store.commit('updateLevelGap', value);
    },
    toggleFlag(store, key) {
      store.commit('toggleFlag', key);
    },
    upgradeSlot(store, tier) {
      let newLevel = store.state.slots[tier].level + 1;
      let data = {
        level: newLevel
      };
      if (newLevel > 0 && tier > 1 && store.state.slots[tier - 1].level < 50) {
        // Previous tier should be > 50 lvl
        return;
      }
      if (newLevel === 1) {
        let perkData = store.getters.perkData(tier, TOWER_PERK_AUTOCYCLES_COUNT);
        data.autoCyclesLeft = getMainTowerPerkValue(tier, TOWER_PERK_AUTOCYCLES_COUNT, perkData.level);
      }
      store.commit('updateSlot', {
        tier,
        data
      });
    },
    captureIncomeValue(store, tier) {
      store.commit('updateSlot', {
        tier,
        data: {
          previousCurrencyIncome: store.getters.incomeValue(tier)
        }
      });
    },
    resetIncomeValue(store, tier) {
      store.commit('updateSlot', {
        tier,
        data: {
          previousCurrencyIncome: null
        }
      });
    },
    updateSlot(store, payload) {
      store.commit('updateSlot', payload);
    },
    updateMode(store, value) {
      store.commit('updateMode', value);
    },
    update(store, data) {
      store.commit("updateState", data);
    },
    subscribe(store) {
      /*this.$app.$game.onNetwork(Events.SDungeonUpdate, data => {
        store.dispatch("update", data);
      });*/
    },
    unsubscribe() {
      //this.$app.$game.offNetwork(Events.SDungeonUpdate);
    },
    /*updateRegenTimers({ getters, state }) {
      console.log("updateRegenTimers");

      state.hpTimer.timeLeft =
        getters.playerStats.hpRegen -
        (this.$app.$game.nowSec - state.user.lastHpRegen);

      state.energyTimer.timeLeft =
        getters.playerStats.energyRegen -
        (this.$app.$game.nowSec - state.user.lastEnergyRegen);
    }*/
  }
};
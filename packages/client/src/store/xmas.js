import _ from "lodash";
import {
  perksTree,
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
  CURRENCY_CHRISTMAS_POINTS
} from "../../../knightlands-shared/xmas";

import Events from "@/../../knightlands-shared/events";
import Operations from "@/../../knightlands-shared/operations";
import timer from "../timer";
import Vue from "vue";

const slots = {};
const initialSlotState = {
  level: 0,
  autoCyclesLeft: 0,
  autoCyclesSpent: 0,
  previousCurrencyIncome: null
};
for (let i = 1; i <= 9; i++) {
  slots[i] = _.clone(initialSlotState);
}

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
    perks: perksTree,
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
      let tierCurrency = farmConfig[tier].currency;
      return state.perks[tierCurrency].tiers[
        tierCurrency === CURRENCY_CHRISTMAS_POINTS ? tier : "all"
      ][perkName];
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
      state.slots[tier].autoCyclesSpent++;
      if (state.slots[tier].autoCyclesLeft > 0) {
        state.slots[tier].autoCyclesLeft--;
      }
    },
    toggleFlag(state, key) {
      state.flags[key] = !state.flags[key];
    },
    commitPerks(state, payload) {
      for (let currencyName in payload) {
        state.perks[currencyName].unlocked = payload[currencyName].unlocked;
        for (let tier in payload[currencyName].tiers) {
          for (let perkName in payload[currencyName].tiers[tier]) {
            state.perks[currencyName].tiers[tier][perkName].level =
            payload[currencyName].tiers[tier][perkName].level;
          }
        }
      }
    }
  },
  actions: {
    commitPerks(store, payload) {
      store.commit('commitPerks', payload);
      for (let tier = 1; tier <= 9; tier++) {
        store.dispatch('updateTierPerks', tier);
      }
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
        data: {
          autoCyclesLeft,
          autoCyclesSpent: 0
        }
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
      // Previous tier should be > 50 lvl
      if (newLevel > 0 && tier > 1 && store.state.slots[tier - 1].level < 50) {
        return;
      }
      store.commit('updateSlot', {
        tier,
        data: {
          level: newLevel
        }
      });
      store.dispatch('updateTierPerks', tier);
    },
    updateTierPerks(store, tier) {
      let data = {};
      let slotData = store.getters.slot(tier);

      // Update autocycles counters
      let perkData = store.getters.perkData(tier, TOWER_PERK_AUTOCYCLES_COUNT);
      if (perkData) {
        let autoCyclesMax = getMainTowerPerkValue(tier, TOWER_PERK_AUTOCYCLES_COUNT, perkData.level);
        data.autoCyclesLeft = autoCyclesMax - slotData.autoCyclesSpent;
      }

      console.log('updateTierPerks', _.cloneDeep({ slotData, perkData, data }));
      if (Object.keys(data).length) {
        store.commit('updateSlot', {
          tier,
          data
        });
      }
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
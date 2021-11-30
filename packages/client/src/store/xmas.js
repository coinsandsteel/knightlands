import _ from "lodash";
import Events from "@/../../knightlands-shared/events";
import {
  getTowerLevelBoundaries,
  farmConfig,
  getFarmTimeData,
  getFarmIncomeData,
  getFarmUpgradeData,
  TOWER_PERK_SPEED,
  TOWER_PERK_BOOST,
  TOWER_PERK_SUPER_SPEED,
  TOWER_PERK_SUPER_BOOST,
} from "../../../knightlands-shared/xmas";

import Operations from "@/../../knightlands-shared/operations";
import timer from "../timer";
import Vue from "vue";

const initialSlotState = {
  level: 0,
  previousCurrencyIncome: null
};

const slots = {};
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
    tower: {
      expirience: 100,
      level: 1,
      currentLevelPercentage: 0
    },
    towerLevelBoundaries: null,
    levelGap: 1,
    slots
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
          100 
          :
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
  },
  mutations: {
    setInitialState(state, data) {},
    updateState(state, data) {},
    resetArea(state) {
      //state.area = _.clone(areaInitialState);
      console.log("Area was reset", state.area);
    },
    upgradeSlot(state, tier) {
      state.slots[tier].level++;
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
        currentLevelExpEnd = state.towerLevelBoundaries[newLevel+1];
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
    }
  },
  actions: {
    setTowerLevelBoundaries(store) {
      store.commit('setTowerLevelBoundaries');
    },
    addExpirience(store, value) {
      store.commit('addExpirience', value);
    },
    updateLevelGap(store, value) {
      store.commit('updateLevelGap', value);
    },
    upgradeSlot(store, tier) {
      store.commit('upgradeSlot', tier);
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
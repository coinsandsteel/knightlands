import _ from "lodash";
import { v4 as uuidv4 } from 'uuid';
import {
  initialSlotState,
  perksTree,
  getTowerLevelBoundaries,
  getMainTowerPerkValue,
  farmConfig,
  getFarmTimeData,
  getFarmIncomeData,
  getFarmUpgradeData,
  TOWER_PERK_INCOME,
  TOWER_PERK_UPGRADE,
  TOWER_PERK_SPEED,
  TOWER_PERK_BOOST,
  TOWER_PERK_SUPER_SPEED,
  TOWER_PERK_SUPER_BOOST,
  TOWER_PERK_AUTOCYCLES_COUNT,
  TOWER_PERK_CYCLE_DURATION,
  CURRENCY_SANTABUCKS,
  CURRENCY_GOLD,
  CURRENCY_UNIT_ESSENCE,
  CURRENCY_CHRISTMAS_POINTS,
  CURRENCY_SHINIES
} from "../../../knightlands-shared/xmas";

import Events from "@/../../knightlands-shared/events";
import Operations from "@/../../knightlands-shared/operations";
import timer from "../timer";
import Vue from "vue";

const slots = {};
for (let i = 1; i <= 9; i++) {
  slots[i] = _.clone(initialSlotState);
}

export default {
  namespaced: true,
  state: {
    loaded: true,
    mode: "manage",
    towerLevelBoundaries: null,
    tower: { // sync with server
      expirience: 0,
      level: 0,
      pecentage: 0
    },
    levelGap: 1,
    slots, // sync with server
    perks: perksTree, // sync with server
    flags: {
      perks: false
    },
    balance: { // sync with server
      [CURRENCY_SANTABUCKS]: 0,
      [CURRENCY_GOLD]: 0,
      [CURRENCY_UNIT_ESSENCE]: 0,
      [CURRENCY_CHRISTMAS_POINTS]: 0,
      [CURRENCY_SHINIES]: 0
    }
  },
  getters: {
    slot: (state) => tier => {
      return {
        ...state.slots[tier],
        currency: farmConfig[tier].currency
      };
    },
    // TODO switch views to slot data
    slotComputed: (state, getters) => tier => {
      return {
        cycleLength: getters.cycleLength(tier),
        upgradePrice: getters.upgradePrice(tier),
        incomeValue: getters.incomeValue(tier)
      };
    },
    // TODO move to backend
    upgradePrice: (state, getters) => tier => {
      let levelGap = 1;
      let level = state.slots[tier].level;
      let showMaxPrice = state.levelGap === Infinity;
      if (level > 0) {
        levelGap = showMaxPrice ? null : state.levelGap;
      }

      let perkData = getters.perkData(tier, TOWER_PERK_UPGRADE);
      let accumulatedPrice = 0;
      let maxAffordableLevel = level;
      let imaginaryAvailableResources = state.balance[CURRENCY_SANTABUCKS];
      let stat = null;
      for (
        let tickLevel = 1;
        showMaxPrice ? imaginaryAvailableResources >= 0 : tickLevel <= levelGap;
        tickLevel++
      ) {
        stat = getFarmUpgradeData(tier, level + tickLevel, {
          upgradePerkLevel: perkData ? perkData.level : 0
        });
        accumulatedPrice += stat.upgradePrice;
        imaginaryAvailableResources -= stat.upgradePrice;
        maxAffordableLevel = level + tickLevel;
        if (level === 0) {
          break;
        }
      }

      if (level > 0 && showMaxPrice) {
        accumulatedPrice -= stat.upgradePrice;
        maxAffordableLevel--;
      }

      return {
        value: accumulatedPrice,
        nextLevel: maxAffordableLevel
      };
    },
    // TODO move to backend
    incomeValue: (state, getters) => tier => {
      let level = state.slots[tier].level;
      let incomePerkData = getters.perkData(tier, TOWER_PERK_INCOME);
      let cyclePerkData = getters.perkData(tier, TOWER_PERK_CYCLE_DURATION);
      let upgradeData = getters.upgradePrice(tier);
      let params = {
        incomePerkLevel: incomePerkData ? incomePerkData.level : 0,
        cycleDurationPerkLevel: cyclePerkData ? cyclePerkData.level : 0,
        [TOWER_PERK_BOOST]: false,
        [TOWER_PERK_SUPER_BOOST]: false
      };
      let currentStat = getFarmIncomeData(tier, level, params);
      let nextStat = getFarmIncomeData(tier, upgradeData.nextLevel, params);
      return { current: currentStat, next: nextStat };
    },
    // TODO move to backend
    cycleLength: (state, getters) => tier => {
      let cyclePerkData = getters.perkData(tier, TOWER_PERK_CYCLE_DURATION);
      let stat = getFarmTimeData(tier, {
        cycleDurationPerkLevel: cyclePerkData ? cyclePerkData.level : 0,
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
    updateState(state, data) {
      console.log("Response from server", data);

      if (data.levelGap !== undefined) {
        state.levelGap = data.levelGap;
        console.log("Level gap changed", data.levelGap);
      }

      if (data.tower !== undefined) {
        state.tower = { ...state.tower, ...data.tower };
        console.log("Tower data", data.tower);
      }

      if (data.accumulated !== undefined) {
        let payload = data.accumulated;
        state.slots[payload.tier].accumulated = {
          ...state.slots[payload.tier].accumulated,
          ...payload.accumulated
        };
        console.log("Tower accumulated", data.accumulated);
      }

      if (data.progress !== undefined) {
        let payload = data.progress;
        state.slots[payload.tier].progress = {
          ...state.slots[payload.tier].progress,
          ...payload.progress
        };
        console.log("Tier progress", payload);
      }

      if (data.cycleLength !== undefined) {
        let payload = data.cycleLength;
        state.slots[payload.tier].stats.cycleLength = payload.cycleLength;
        console.log("Tier cycle length", payload);
      }

      if (data.upgradePrice !== undefined) {
        let payload = data.upgradePrice;
        state.slots[payload.tier].stats.upgradePrice = payload.upgradePrice;
        console.log("Upgrade price changed", payload);
      }

      if (data.income !== undefined) {
        let payload = data.income;
        state.slots[payload.tier].stats.income.current = {
          ...state.slots[payload.tier].stats.income.current,
          ...payload.current
        };
        state.slots[payload.tier].stats.income.next = {
          ...state.slots[payload.tier].stats.income.next,
          ...payload.next
        };
        console.log("Income changed", payload);
      }

      if (data.branch !== undefined) {
        let payload = data.branch;
        state.perks[payload.currency].unlocked = payload.unlocked;
        console.log("Perk branch unlocked", payload);
      }

      if (data.perk !== undefined) {
        let payload = data.perk;
        for (let tier in payload.tiers) {
          for (let perkName in payload.tiers[tier]) {
            state.perks[payload.currency].tiers[tier][perkName] = {
              ...state.perks[payload.currency].tiers[tier][perkName],
              ...payload.tiers[tier][perkName]
            };
            console.log("Perk changed", payload.currency, tier, perkName, payload.tiers[tier][perkName]);
          }
        }
      }

      if (data.balance !== undefined) {
        state.balance = {
          ...state.balance,
          ...data.balance
        };
        console.log("Balance changed", data.balance);
      }
    },
    /*decreaseBalance(state, { currency, amount }) {
      state.balance[currency] -= amount;
    },
    increaseBalance(state, { currency, amount }) {
      state.balance[currency] += amount;
    },*/
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
    /*addExpirience(state, value) {
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
        state.slots[tier].autoCyclesSpent++;
      } else {
        state.slots[tier].autoCyclesSpent = 0;
      }
    },*/
    toggleFlag(state, key) {
      state.flags[key] = !state.flags[key];
    },
    // TODO refactor and use in the updateState mutation
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
    async load(store) {
      let result = await this.$app.$game._wrapOperation(Operations.XmasLoad);
      store.dispatch("init", result.response);
    },
    init(store, data) {
      store.commit("setInitialState", data);
    },
    update(store, data) {
      store.commit("updateState", data);
    },
    subscribe(store) {
      this.$app.$game.onNetwork(Events.XmasUpdate, data => {
        store.dispatch("update", data);
      });
    },
    unsubscribe() {
      this.$app.$game.offNetwork(Events.XmasUpdate);
    },
    async commitPerks(store, payload) {
      await this.$app.$game._wrapOperation(Operations.XmasCommitPerks, payload);
      // TOFO move to backend
      /*
      store.commit('commitPerks', payload);
      for (let tier = 1; tier <= 9; tier++) {
        store.dispatch('updateTierPerks', tier);
      }
      */
    },
    setInitialState(state, data) {
      if (!data) {
        return;
      }
      // TODO init store
    },
    /*setTowerLevelBoundaries(store) {
      store.commit('setTowerLevelBoundaries');
    },
    cycleFinished(store, tier) {
      store.commit('decreaseAutoCycleCount', tier);
    },
    epochFinished(store, tier) {
      let perkData = store.getters.perkData(tier, TOWER_PERK_AUTOCYCLES_COUNT);
      let autoCyclesLeft = getMainTowerPerkValue(tier, TOWER_PERK_AUTOCYCLES_COUNT, perkData.level);
      store.dispatch('updateSlot', {
        tier,
        data: {
          autoCyclesLeft,
          autoCyclesSpent: 0
        }
      });
    },
    addExpirience(store, value) {
      store.commit('addExpirience', value);
    },*/
    async updateLevelGap(store, value) {
      await this.$app.$game._wrapOperation(Operations.XmasUpdateLevelGap, { value });
      // TODO move to backend
      /*
      store.commit('updateLevelGap', value);
      */
    },
    toggleFlag(store, key) {
      store.commit('toggleFlag', key);
    },
    // Could be useful
    updateSlot(store, { tier, data }) {
      store.commit('updateSlot', { tier, data });
    },
    async upgradeSlot(store, { tier }) {
      await this.$app.$game._wrapOperation(Operations.XmasFarmUpgrade, { tier });
      return;

      // TODO move to backend
      /*
      let newLevel = level;
      // Previous tier should be > 50 lvl
      if (newLevel > 0 && tier > 1 && store.state.slots[tier - 1].level < 50) {
        return;
      }
      store.dispatch('updateSlot', {
        tier,
        data: {
          level: newLevel
        }
      });
      store.dispatch('updateTierPerks', tier);

      // Reset slot
      this.$store.dispatch("xmas/epochFinished", this.tier);
      this.resetTimer();
      this.progress = 0;
      this.totalCurrencyIncomeValue = 0;
      this.totalExpIncomeValue = 0;
      */
    },
    async harvest(store, { tier }) {
      await this.$app.$game._wrapOperation(Operations.XmasHarvest, { tier });
      return;

      // TODO move to backend
      /*
      store.dispatch("xmas/addExpirience", this.totalExpIncomeValue);
      store.commit("xmas/increaseBalance", {
        currency: this.slot.currency,
        amount: this.totalCurrencyIncomeValue
      });

      // Reset slot
      this.$store.dispatch("xmas/epochFinished", this.tier);
      this.resetTimer();
      this.progress = 0;
      this.totalCurrencyIncomeValue = 0;
      this.totalExpIncomeValue = 0;
      */
    },
    /*updateTierPerks(store, tier) {
      let data = {};
      let slotData = store.getters.slot(tier);

      // Update autocycles counters
      let perkData = store.getters.perkData(tier, TOWER_PERK_AUTOCYCLES_COUNT);
      if (perkData) {
        let autoCyclesMax = getMainTowerPerkValue(tier, TOWER_PERK_AUTOCYCLES_COUNT, perkData.level);
        data.autoCyclesLeft = autoCyclesMax - slotData.autoCyclesSpent;
      }

      if (Object.keys(data).length) {
        store.dispatch('updateSlot', {
          tier,
          data
        });
      }
    },*/
    updateMode(store, value) {
      store.commit('updateMode', value);
    }
  }
};
import _ from "lodash";
import {
  initialSlotState,
  perksTree,
  farmConfig,
  CURRENCY_SANTABUCKS,
  CURRENCY_GOLD,
  CURRENCY_UNIT_ESSENCE,
  CURRENCY_CHRISTMAS_POINTS,
  CURRENCY_SHINIES
} from "../../../knightlands-shared/xmas";

import Events from "@/../../knightlands-shared/events";
import Operations from "@/../../knightlands-shared/operations";

const slots = {};
for (let i = 1; i <= 9; i++) {
  slots[i] = _.cloneDeep(initialSlotState);
}

export default {
  namespaced: true,
  state: {
    loaded: true,
    mode: "manage",
    towerLevelBoundaries: null,
    tower: {
      exp: 0,
      level: 0,
      pecentage: 0
    },
    levelGap: 1,
    slots,
    perks: perksTree,
    flags: {
      perks: false
    },
    balance: {
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

      if (data.level !== undefined) {
        let payload = data.level;
        state.slots[payload.tier].level = payload.level;
        console.log("Farm level", data.level);
      }

      if (data.accumulated !== undefined) {
        let payload = data.accumulated;
        state.slots[payload.tier].accumulated = {
          ...state.slots[payload.tier].accumulated,
          ...payload.accumulated
        };
        console.log("Farm accumulated", data.accumulated);
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

      if (data.upgrade !== undefined) {
        let payload = data.upgrade;
        for (let tier in payload) {
          state.slots[tier].stats.upgrade = {
            ...state.slots[tier].stats.upgrade,
            ...payload[tier]
          };
        }
        console.log("Upgrade price changed", payload);
      }

      if (data.income !== undefined) {
        let payload = data.income;
        for (let tier in payload) {
          state.slots[tier].stats.income.current = {
            ...state.slots[tier].stats.income.current,
            ...payload[tier].current
          };
          state.slots[tier].stats.income.next = {
            ...state.slots[tier].stats.income.next,
            ...payload[tier].next
          };
        }
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

      if (data.cycleStarted !== undefined) {
        this.$app.$emit("cycle-started", data.cycleStarted.tier);
        console.log("Cycle started", data.cycleStarted);
      }
    },
    updateMode(state, value) {
      state.mode = value;
    },
    updateLevelGap(state, value) {
      state.levelGap = value;
    },
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
    },
    setInitialState(state, data) {
      state.levelGap = data.levelGap;
      state.tower = { ...state.tower, ...data.tower };
      state.slots = { ...state.slots, ...data.slots };
      state.perks = { ...state.perks, ...data.perks };
      state.balance = { ...state.balance, ...data.balance };
      state.loaded = true;
    }
  },
  actions: {
    async load(store) {
      let result = await this.$app.$game._wrapOperation(Operations.XmasLoad);
      store.commit("setInitialState", result.response);
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
    async commitPerks(store, perks) {
      await this.$app.$game._wrapOperation(Operations.XmasCommitPerks, { perks });
    },
    async updateLevelGap(store, value) {
      await this.$app.$game._wrapOperation(Operations.XmasUpdateLevelGap, { value });
    },
    toggleFlag(store, key) {
      store.commit('toggleFlag', key);
    },
    async upgradeSlot(store, { tier }) {
      await this.$app.$game._wrapOperation(Operations.XmasFarmUpgrade, { tier });
    },
    async harvest(store, { tier }) {
      await this.$app.$game._wrapOperation(Operations.XmasHarvest, { tier });
    },
    updateMode(store, value) {
      store.commit('updateMode', value);
    }
  }
};

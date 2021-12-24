import _ from "lodash";
import {
  initialSlotState,
  perksTree,
  burstPerksTree,
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
    rebalance: {
      price: 0,
      counter: 1
    },
    tower: {
      exp: 0,
      level: 0,
      pecentage: 0
    },
    levelGap: 1,
    slots,
    burstPerks: burstPerksTree,
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
    },
    cpoints: {
      score: 0,
      shares: 0,
      lastClaimed: 0
    }
  },
  getters: {
    slot: state => tier => {
      return {
        ...state.slots[tier],
        currency: farmConfig[tier].currency
      };
    }
  },
  mutations: {
    updateState(state, data) {
      if (data.cpoints !== undefined) {
        state.cpoints.score = data.cpoints.score;
        state.cpoints.shares = data.cpoints.shares;
        state.cpoints.lastClaimed = data.cpoints.lastClaimed;
      }

      if (data.levelGap !== undefined) {
        state.levelGap = data.levelGap;
        // console.log("Level gap changed", data.levelGap);
      }

      if (data.tower !== undefined) {
        state.tower = { ...state.tower, ...data.tower };
        // console.log("Tower data", data.tower);
      }

      if (data.level !== undefined) {
        let payload = data.level;
        state.slots[payload.tier].level = payload.level;
        // console.log("Farm level", data.level);
      }

      if (data.accumulated !== undefined) {
        let payload = data.accumulated;
        state.slots[payload.tier].accumulated = {
          ...state.slots[payload.tier].accumulated,
          ...payload.accumulated
        };
        this.$app.$emit("accumulated", {
          tier: payload.tier,
          currency: payload.accumulated.currency,
          exp: payload.accumulated.exp
        });
        // console.log("Farm accumulated", data.accumulated);
      }

      if (data.progress !== undefined) {
        let payload = data.progress;
        for (let tier in payload) {
          state.slots[tier].progress = {
            ...state.slots[tier].progress,
            ...payload[tier]
          };
        }
        // console.log("Tier progress", payload);
      }

      if (data.cycleLength !== undefined) {
        let payload = data.cycleLength;
        for (let tier in payload) {
          state.slots[tier].stats.cycleLength = payload[tier];
        }
        // console.log("Tier cycle length", payload);
      }

      if (data.upgrade !== undefined) {
        let payload = data.upgrade;
        for (let tier in payload) {
          state.slots[tier].stats.upgrade = {
            ...state.slots[tier].stats.upgrade,
            ...payload[tier]
          };
        }
        // console.log("Upgrade price changed", payload);
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
        // console.log("Income changed", payload);
      }

      if (data.branch !== undefined) {
        let payload = data.branch;
        state.perks[payload.currency].unlocked = payload.unlocked;
        // console.log("Perk branch unlocked", payload);
      }

      if (data.perks !== undefined) {
        let payload = data.perks;
        for (let currency in payload) {
          state.perks[currency].unlocked = payload[currency].unlocked;
          for (let tier in payload[currency].tiers) {
            for (let perkName in payload[currency].tiers[tier]) {
              state.perks[currency].tiers[tier][perkName] = {
                ...state.perks[currency].tiers[tier][perkName],
                ...payload[currency].tiers[tier][perkName]
              };
            }
          }
        }
        // console.log("Perks updated", payload);
      }

      if (data.burstPerks !== undefined) {
        let payload = data.burstPerks;
        for (let perkName in payload) {
          state.burstPerks[perkName] = {
            ...state.burstPerks[perkName],
            ...payload[perkName]
          };
        }
        // console.log("Burst perks updated", payload);
      }

      if (data.slotPerks !== undefined) {
        let payload = data.slotPerks;
        state.slots[payload.tier].slotPerks = {
          ...state.slots[payload.tier].slotPerks,
          ...payload.slotPerks
        };
        console.log("Slot perks updated", payload);
      }

      if (data.balance !== undefined) {
        state.balance = {
          ...state.balance,
          ...data.balance
        };
        // console.log("Balance changed", data.balance);
      }

      if (data.rebalance !== undefined) {
        state.rebalance = {
          ...state.rebalance,
          ...data.rebalance
        };
        // console.log("Perks rebalance", data.rebalance);
      }

      if (data.cycleStart !== undefined) {
        this.$app.$emit("cycle-start", data.cycleStart.tier);
        console.log("Cycle start", data.cycleStart);
      }

      if (data.cycleStop !== undefined) {
        this.$app.$emit("cycle-stop", data.cycleStop.tier);
        console.log("Cycle stop", data.cycleStop);
      }

      if (data.launched !== undefined) {
        let payload = data.launched;
        for (let tier in payload) {
          state.slots[tier].launched = payload[tier];
        }
        // console.log("Launch state", data.launched);
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
    setInitialState(state, data) {
      state.levelGap = data.levelGap;
      state.tower = { ...state.tower, ...data.tower };
      state.slots = { ...state.slots, ...data.slots };
      state.perks = { ...state.perks, ...data.perks };
      state.balance = { ...state.balance, ...data.balance };
      state.rebalance = { ...state.rebalance, ...data.rebalance };
      state.cpoints = { ...state.cpoints, ...data.cpoints };
      state.loaded = true;
      console.log("setInitialState", data);
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
    async commitPerks(store, data) {
      await this.$app.$game._wrapOperation(Operations.XmasCommitPerks, data);
    },
    async rebalancePerks() {
      await this.$app.$game._wrapOperation(Operations.XmasRebalancePerks);
    },
    async activatePerk(store, data) {
      await this.$app.$game._wrapOperation(Operations.XmasActivatePerk, data);
    },
    async commitSlotPerks(store, data) {
      await this.$app.$game._wrapOperation(Operations.XmasCommitSlotPerks, data);
    },
    async updateLevelGap(store, value) {
      await this.$app.$game._wrapOperation(Operations.XmasUpdateLevelGap, {
        value
      });
    },
    toggleFlag(store, key) {
      store.commit("toggleFlag", key);
    },
    async upgradeSlot(store, { tier }) {
      await this.$app.$game._wrapOperation(Operations.XmasFarmUpgrade, {
        tier
      });
    },
    async cpStatus() {
      return (
        await this.$app.$game._wrapOperation(Operations.XmasCPointsStatus)
      ).response;
    },
    async harvest(store, { tier }) {
      await this.$app.$game._wrapOperation(Operations.XmasHarvest, { tier });
    },
    updateMode(store, value) {
      store.commit("updateMode", value);
    }
  }
};

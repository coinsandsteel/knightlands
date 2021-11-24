import _ from "lodash";
import Events from "@/../../knightlands-shared/events";
import * as xmas from "../../../knightlands-shared/xmas";

import Operations from "@/../../knightlands-shared/operations";
import timer from "../timer";
import Vue from "vue";


export default {
  namespaced: true,
  state: {
    loaded: true,
    mode: "manage",
    area: {},
    user: {},
    activeMultiplier: 1,
    slots: {
      1: {
        level: 0
      },
      2: {
        level: 0
      },
      3: {
        level: 0
      },
      4: {
        level: 0
      },
      5: {
        level: 0
      },
      6: {
        level: 0
      },
      7: {
        level: 0
      },
      8: {
        level: 0
      },
      9: {
        level: 0
      }
    }
  },
  getters: {
    slot: (state, getters) => tier => {
      return {
        ...state.slots[tier],
        upgradePrice: xmas.abbreviateNumber(getters.upgradePrice(tier)),
        collectValue: xmas.abbreviateNumber(getters.collectValue(tier)),
        currency: xmas.tierCurrencies[tier]
      };
    },
    collectValue: state => tier => {
      let level = state.slots[tier].level;
      if (level === 0) {
        return 0;
      }
      let step = tier * 1000 * Math.pow(level + 1, 1.5);
      return Math.floor(step / 100);
    },
    upgradePrice: state => tier => {
      // TODO calc custom multiplier
      let customMultiplier = 23;
      let level = state.slots[tier].level;

      let activeMultiplier = 1;
      if (level > 0) {
        activeMultiplier = state.activeMultiplier === Infinity ?
          customMultiplier 
          :
          state.activeMultiplier;
      }

      let step = tier * 1000 * Math.pow(level + 1, 1.5) * activeMultiplier;
      return Math.floor(step);
    },
    playerStats: state => nextStats => {
      return {};
    },
  },
  mutations: {
    setInitialState(state, data) {},
    updateState(state, data) {
      /*console.log("Response from server", data);

      if (data.invis !== undefined) {
        state.user.invis = data.invis;
      }

      // cellRevealed
      if (data.cell) {
        console.log("New cell", data.cell);
        state.maze.revealed.push(...data.cell);
      }
      // energyChanged
      if (data.energy !== undefined) {
        console.log("User energy", data.energy);
        Vue.prototype.$app.logEvent("dungeon-player-energy", {
          energy: Math.abs(data.energy - state.user.energy)
        });
        state.user.energy = data.energy;
      }
      // combatStarted
      if (data.combat !== undefined) {
        console.log("Combat status updated", data.combat);
        state.combat = {
          ...state.combat,
          ...data.combat
        };
        state.hpTimer.stop();
        state.energyTimer.stop();
      }
      // enemyHealth
      if (state.combat.enemyId && data.enemyHealth !== undefined) {
        console.log("Enemy HP", data.enemyHealth);
        state.combat.enemyHealth = data.enemyHealth;
      }
      // playerHealth
      if (data.playerHealth !== undefined) {
        console.log("Player HP", data.playerHealth);
        state.user.health = data.playerHealth;
      }
      // playerMoved
      if (data.moveTo !== undefined) {
        console.log("User moved to cell", data.moveTo);
        state.user.cell = data.moveTo;
      }

      if (data.enemy !== undefined) {
        Vue.prototype.$set(
          state.maze.revealed[data.enemy.cell].enemy,
          "health",
          data.enemy.health
        );
      }

      if (data.noEnemy !== undefined) {
        state.maze.revealed[data.noEnemy].enemy = undefined;
        state.maze.enemiesLeft--;
      }

      if (data.altar !== undefined) {
        console.log("Altar used", data.altar);
        state.maze.revealed[data.altar].altar = undefined;
        console.log(state.maze.revealed[data.altar]);
      }

      if (data.trap !== undefined) {
        console.log("Trap used", data.trap);
        state.maze.revealed[data.trap].trap = undefined;
      }

      if (data.exp !== undefined) {
        console.log("User XP", data.exp);
        Vue.prototype.$app.logEvent("dungeon-player-exp", {
          exp: Math.abs(data.exp - state.user.exp)
        });
        state.user.exp = data.exp;
      }

      if (data.level !== undefined) {
        console.log("User level changed", data.level);
        state.user.level = data.level;
      }

      if (data.stats !== undefined) {
        console.log("User stats changed", data.stats);
        state.user.stats = { ...state.user.stats, ...data.stats };
      }

      if (data.loot !== undefined) {
        console.log("Loot received", data.loot);
        state.maze.revealed[data.loot].loot = undefined;
      }

      if (data.regen) {
        console.log("Health and energy regen", data.regen);
        state.user.lastHpRegen = data.regen.hp || state.user.lastHpRegen;
        state.user.lastEnergyRegen =
          data.regen.energy || state.user.lastEnergyRegen;
      }

      if (data.equip) {
        console.log("User was equiped", data.equip);
        state.user.mHand = data.equip.mHand;
        state.user.oHand = data.equip.oHand;
      }

      if (data.free !== undefined) {
        state.maze.isFree = data.free;
      }*/
    },
    resetArea(state) {
      //state.area = _.clone(areaInitialState);
      console.log("Area was reset", state.area);
    },
    upgradeSlot(state, tier) {
      state.slots[tier].level++;
    },
    updateMode(state, value) {
      state.mode = value;
    },
    updateMultiplier(state, value) {
      state.activeMultiplier = value;
    },
  },
  actions: {
    updateMultiplier(store, value) {
      store.commit('updateMultiplier', value);
    },
    upgradeSlot(store, tier) {
      store.commit('upgradeSlot', tier);
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
    /*init({ commit, getters, state }, data) {
      console.log("init");
      commit("setInitialState", data);

      // initialize timers

      /onst playerStats = getters.playerStats(null);
      state.hpTimer.removeAllListeners("finished");
      state.hpTimer.timeLeft =
        playerStats.hpRegen - (this.$app.$game.nowSec - state.user.lastHpRegen);

      state.hpTimer.on("finished", () => {
        const timeElapsed = this.$app.$game.nowSec - state.user.lastHpRegen;
        const hpRegened = Math.min(
          Math.floor(timeElapsed / playerStats.hpRegen),
          playerStats.maxHealth - state.user.health
        );

        if (hpRegened > 0) {
          commit("addHealth", hpRegened);
          state.user.lastHpRegen += hpRegened * playerStats.hpRegen;
        }

        state.hpTimer.timeLeft =
          playerStats.hpRegen -
          (this.$app.$game.nowSec - state.user.lastHpRegen);
      });

      state.energyTimer.removeAllListeners("finished");
      state.energyTimer.timeLeft =
        playerStats.energyRegen -
        (this.$app.$game.nowSec - state.user.lastEnergyRegen);

      state.energyTimer.on("finished", () => {
        const timeElapsed = this.$app.$game.nowSec - state.user.lastEnergyRegen;
        const energyRegened = Math.min(
          Math.floor(timeElapsed / playerStats.energyRegen),
          playerStats.maxEnergy - state.user.energy
        );

        if (energyRegened > 0) {
          commit("addEnergy", energyRegened);
          state.user.lastEnergyRegen += energyRegened * playerStats.energyRegen;
        }

        state.hpTimer.timeLeft =
          playerStats.energyRegen -
          (this.$app.$game.nowSec - state.user.lastEnergyRegen);
      });
    },
    async load(store) {
      let result = await this.$app.$game._wrapOperation(
        Operations.SDungeonLoad
      );
      store.dispatch("init", result.response);
    },
    /*async revealCell(store, index) {
      await this.$app.$game._wrapOperation(Operations.SDungeonRevealCell, {
        cellId: index
      });
    },
    async useCell(store, index) {
      const response = (
        await this.$app.$game._wrapOperation(Operations.SDungeonUseCell, {
          cellId: index
        })
      ).response;
      return response;
    },
    async moveToCell(store, index) {
      await this.$app.$game._wrapOperation(Operations.SDungeonMove, {
        cellId: index
      });
    },
    async combat(store, move) {
      return (
        await this.$app.$game._wrapOperation(Operations.SDunegonCombatAction, {
          action: CombatAction.Attack,
          data: {
            move
          }
        })
      ).response;
    },
    async commitStats(store, stats) {
      await this.$app.$game._wrapOperation(Operations.SDunegonCommitStats, {
        stats
      });
    },
    resetCombat(store) {
      store.commit("resetCombat");
    },
    async reset(store) {
      await this.$app.$game._wrapOperation(Operations.SDungeonGenerateNew);
      await store.dispatch("load");
    },
    updateRegenTimers({ getters, state }) {
      console.log("updateRegenTimers");

      state.hpTimer.timeLeft =
        getters.playerStats.hpRegen -
        (this.$app.$game.nowSec - state.user.lastHpRegen);

      state.energyTimer.timeLeft =
        getters.playerStats.energyRegen -
        (this.$app.$game.nowSec - state.user.lastEnergyRegen);
    },
    async sendTestAction(store, action) {
      await this.$app.$game._wrapOperation(Operations.SDungeonTestAction, {
        action
      });
    },
    async equip(store, data) {
      await this.$app.$game._wrapOperation(Operations.SDungeonEquip, data);
    },
    async fetchRank() {
      return (
        await this.$app.$game._wrapOperation(Operations.SDungeonRank, {
          personal: true
        })
      ).response;
    },
    async fetchRankings(store, page) {
      return (
        await this.$app.$game._wrapOperation(Operations.SDungeonRank, {
          page
        })
      ).response;
    }*/
  }
};
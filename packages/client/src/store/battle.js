import _ from "lodash";
import Vue from "vue";
import * as battle from "@/../../knightlands-shared/battle";
import Events from "@/../../knightlands-shared/events";
import Operations from "@/../../knightlands-shared/operations";
import {
  GAME_DIFFICULTY_HIGH,
  GAME_DIFFICULTY_MEDIUM,
  SHOP_STARTER_PACK,
  SHOP_DAILY_REWARD,
  SHOP_ENERGY_CHEST,
  SHOP_COIN_CHEST
} from "@/../../knightlands-shared/battle";

const BATTLE_TIERS_FILTER = "BATTLE_TIERS_FILTER";
const BATTLE_CLASSES_FILTER = "BATTLE_CLASSES_FILTER";

let selectedTiersFilter = [];
if (localStorage.getItem(BATTLE_TIERS_FILTER)) {
  selectedTiersFilter = JSON.parse(localStorage.getItem(BATTLE_TIERS_FILTER));
}
let selectedClassesFilter = [];
if (localStorage.getItem(BATTLE_CLASSES_FILTER)) {
  selectedClassesFilter = JSON.parse(
    localStorage.getItem(BATTLE_CLASSES_FILTER)
  );
}

export default {
  namespaced: true,
  state: {
    // @todo: set to false
    loaded: false,
    selectedTiersFilter,
    selectedClassesFilter,
    hasSubscribed: false,
    hasShownDailyRewards: false,

    // User data
    user: {
      balance: {
        energy: 0,
        coins: 0, // Source: PvE, Purpose: upgrade units level
        crystals: 0 // Source: PvP, Purpose: upgrade abilities level
      },
      timers: {
        energy: 0
      },
      rewards: {
        dailyRewards: [
          /*{
            collected: true,
            quantity: 1,
            active: true,
            date: "123"
          },
          {
            collected: false,
            quantity: 1,
            active: false
          }*/
        ],
        rankingRewards: [
          // Will be later
        ]
      },
      // 6 rooms
      adventures: {
        1: {
          1: { [GAME_DIFFICULTY_MEDIUM]: true, [GAME_DIFFICULTY_HIGH]: false }
          //2: { [GAME_DIFFICULTY_MEDIUM]: false, [GAME_DIFFICULTY_HIGH]: false },
        }
      },
      shop: {
        [SHOP_STARTER_PACK]: { left: 1 },
        [SHOP_DAILY_REWARD]: { left: 2 },
        [SHOP_ENERGY_CHEST]: { left: 6 },
        [SHOP_COIN_CHEST]: { left: 2 }
      }
    },

    // Unit list data
    inventory: [],

    // Game
    game: {
      mode: null, // string|null: GAME_MODE_DUEL | GAME_MODE_ADVENTURE
      room: null, // number|null: 0-7
      level: null, // number|null: 0-5
      difficulty: null, // string: GAME_DIFFICULTY_LOW | GAME_DIFFICULTY_MEDIUM | GAME_DIFFICULTY_HIGH
      adventureDifficulty: GAME_DIFFICULTY_MEDIUM, // string GAME_DIFFICULTY_MEDIUM | GAME_DIFFICULTY_HIGH

      // User squad
      userSquad: {
        power: 0,
        bonuses: [],
        units: []
      },

      // Enemy squad
      enemySquad: {
        power: 0,
        bonuses: [],
        units: []
      },

      // Terrain
      terrain: null,

      // Active combat's data
      combat: {
        started: false,
        result: null, // string|null: COMBAT_RESULT_WIN | COMBAT_RESULT_LOOSE
        // @todo: set to false
        // isMyTurn: true, // boolean|null
        activeFighterId: null,
        runtime: {
          selectedAbilityClass: null, // string|null
          moveCells: [], // number[]
          attackCells: [], // number[],
          targetCells: [], // number[],
          queue: [
            // Unit moved
            /*{
              action: "move",
              unitId: "v4nv9",
              newIndex: 8
            },
            // Unit attack
            {
              action: battle.ABILITY_TYPE_ATTACK,
              source: {
                unitId: "v4nv9",
                index: 3
              },
              target: {
                unitId: "v4nv9",
                index: 8,
                newHp: 5
              },
              ability: {
                // may be null
                abilityClass: battle.ABILITY_DEATH_SHOT,
                damage: 5,
                criticalHit: false
              }
            },
            // Unit buff
            {
              action: battle.ABILITY_TYPE_BUFF | battle.ABILITY_TYPE_DE_BUFF,
              source: {
                unitId: "v4nasv9",
                index: 3
              },
              target: {
                unitId: "45v83tn",
                index: 20
              },
              buff: {
                abilityClass: battle.ABILITY_RAGE,
                type: "damage_increase",
                value: 1.25,
                probability: 0.5,
                duration: 1
              }
            },
            // Unit self buff
            {
              action: battle.ABILITY_TYPE_SELF_BUFF,
              source: {
                unitId: "v4nv9",
                index: 3
              },
              buff: {
                abilityClass,
                type: "speed_reduce",
                value: 1.1,
                probability: 0.5,
                duration: 1
              }
            },
            // Lava damage (or other effects)
            {
              action: "effect",
              source: {
                terrainId: "v4nv9",
                index: 3
              },
              target: {
                unitId: "v4nv9",
                index: 8,
                newHp: 5
              },
              effect: {
                effectClass: "heat",
                damage: 1
              }
            }*/
          ]
        }
      }
    }
  },
  getters: {
    dailyRewards(state) {
      return state.user && state.user.rewards
        ? state.user.rewards.dailyRewards || []
        : [];
    },
    rankingRewards(state) {
      return state.user && state.user.rewards
        ? state.user.rewards.rankingRewards || []
        : [];
    },
    battleTerrain(state) {
      const terrain = state.game.terrain;
      const result = [
        ...[null, null, null, null, null],
        ...(terrain && terrain.tiles && terrain.tiles.length === 25
          ? terrain.tiles
          : Array(25).fill(null)),
        ...[null, null, null, null, null]
      ];
      return result.map((tile, index) => ({
        index,
        tile: tile || (terrain && terrain.base) || battle.TERRAIN_GRASS
      }));
    },
    units(state) {
      return (state.game && state.game.userSquad
        ? state.game.userSquad.units || []
        : []
      ).filter(Boolean);
    },
    isUnitsFullFilled(state, getters) {
      return getters.units.length === 5;
    },
    activeFighterId(state) {
      return state.game.combat.activeFighterId;
    },
    isMyTurn(state, getters) {
      return !!(
        getters.activeFighterId &&
        getters.units &&
        getters.units.find(
          ({ fighterId }) => fighterId === getters.activeFighterId
        )
      );
    },
    moveCells(state, getters) {
      // if (!getters.isMyTurn) {
      //   return [];
      // }
      return state.game && state.game.combat && state.game.combat.runtime
        ? state.game.combat.runtime.moveCells || []
        : [];
    },
    attackCells(state, getters) {
      // if (!getters.isMyTurn) {
      //   return [];
      // }
      return state.game && state.game.combat && state.game.combat.runtime
        ? state.game.combat.runtime.attackCells || []
        : [];
    },
    targetCells(state, getters) {
      return state.game && state.game.combat && state.game.combat.runtime
        ? state.game.combat.runtime.targetCells || []
        : [];
    },
    enemyUnits(state) {
      return (state.game && state.game.enemySquad
        ? state.game.enemySquad.units || []
        : []
      ).filter(Boolean);
    },
    // TODO unit > fighter
    enemySelectedUnitId(state, getters) {
      if (getters.isMyTurn) {
        return null;
      }
      return state.game && state.game.combat && state.game.combat.runtime
        ? state.game.combat.runtime.unitId
        : null;
    },
    // TODO unit > fighter
    enemySelectedUnit(state, getters) {
      if (!getters.enemySelectedUnitId) {
        return null;
      }

      return getters.enemyUnits.find(
        ({ unitId }) => unitId === getters.enemySelectedUnitId
      );
    },
    enemyMoveCells(state, getters) {
      // if (getters.isMyTurn) {
      //   return [];
      // }
      return state.game && state.game.combat && state.game.combat.runtime
        ? state.game.combat.runtime.moveCells || []
        : [];
    },
    enemyAttackCells(state, getters) {
      // if (getters.isMyTurn) {
      //   return [];
      // }
      return state.game && state.game.combat && state.game.combat.runtime
        ? state.game.combat.runtime.attackCells || []
        : [];
    }
  },
  mutations: {
    updateState(state, data) {
      if (data.hasShownDailyRewards !== undefined) {
        state.hasShownDailyRewards = !!data.hasShownDailyRewards;
      }

      // Add an inventory unit
      if (data.addUnit !== undefined) {
        state.inventory.push(...data.addUnit);
      }

      // Update an inventory unit
      if (data.updateUnit !== undefined) {
        const index = state.inventory.findIndex(
          unit => unit.unitId === data.updateUnit.unitId
        );
        if (index !== -1) {
          Vue.set(state.inventory, index, data.updateUnit);
        }
      }

      // Reset an inventory
      if (data.inventory !== undefined) {
        state.inventory = data.inventory;
      }

      // User data
      if (data.balance !== undefined) {
        state.balance = { ...state.balance, ...data.balance };
      }
      if (data.timers !== undefined) {
        state.timers = { ...state.timers, ...data.timers };
      }
      if (data.dailyRewards !== undefined) {
        state.rewards.dailyRewards = data.dailyRewards;
      }
      if (data.rankingRewards !== undefined) {
        state.rewards.rankingRewards = data.rankingRewards;
      }

      // Game data
      if (data.mode !== undefined) {
        state.game.mode = data.mode;
      }
      if (data.room !== undefined) {
        state.game.room = data.room;
      }
      if (data.level !== undefined) {
        state.game.level = data.level;
      }
      if (data.difficulty !== undefined) {
        state.game.difficulty = data.difficulty;
      }
      if (data.adventureDifficulty !== undefined) {
        state.game.adventureDifficulty = data.adventureDifficulty;
      }

      // Set a whole user/enemy squad.
      // Will be called only while in a lobby.
      // Not for a combat.
      if (data.userSquad !== undefined) {
        state.game.userSquad.power = data.userSquad.power;
        state.game.userSquad.bonuses = data.userSquad.bonuses;
        state.game.userSquad.units = data.userSquad.units;
      }
      if (data.enemySquad !== undefined) {
        state.game.enemySquad.power = data.enemySquad.power;
        state.game.enemySquad.bonuses = data.enemySquad.bonuses;
        state.game.enemySquad.units = data.enemySquad.units;
      }

      // #############################################
      // Combat
      // #############################################

      if (data.terrain !== undefined) {
        state.game.terrain = data.terrain;
      }

      if (data.buffs !== undefined) {
        for (let fighterId in data.buffs) {
          // User squad
          let index = state.game.userSquad.units.findIndex(
            unit => unit.fighterId === fighterId
          );

          if (index !== -1) {
            Vue.set(
              state.game.userSquad.units[index],
              "buffs",
              data.buffs[fighterId]
            );
          }

          // Enemy squad
          index = state.game.enemySquad.units.findIndex(
            unit => unit.fighterId === fighterId
          );

          if (index !== -1) {
            Vue.set(
              state.game.enemySquad.units[index],
              "buffs",
              data.buffs[fighterId]
            );
          }
        }
      }

      if (data.abilities !== undefined) {
        for (let fighterId in data.abilities) {
          // User squad
          let index = state.game.userSquad.units.findIndex(
            unit => unit.fighterId === fighterId
          );

          if (index !== -1) {
            Vue.set(
              state.game.userSquad.units[index],
              "abilities",
              data.abilities[fighterId]
            );
          }

          // Enemy squad
          index = state.game.enemySquad.units.findIndex(
            unit => unit.fighterId === fighterId
          );

          if (index !== -1) {
            Vue.set(
              state.game.enemySquad.units[index],
              "abilities",
              data.abilities[fighterId]
            );
          }
        }
      }

      // Array of unit updates during the combat
      // Could be updated: index, hp, abilities, buffs
      if (data.userFighter !== undefined) {
        data.userFighter.forEach(updateEntry => {
          const index = state.game.userSquad.units.findIndex(
            unit => unit.fighterId === updateEntry.fighterId
          );

          if (index !== -1) {
            Vue.set(state.game.userSquad.units, index, {
              ...state.game.userSquad.units[index],
              ...updateEntry
            });
          }
        });
      }

      // Array of unit updates during the combat
      // Could be updated: index, hp, abilities, buffs
      if (data.enemyFighter !== undefined) {
        data.enemyFighter.forEach(updateEntry => {
          const index = state.game.enemySquad.units.findIndex(
            unit => unit.fighterId === updateEntry.fighterId
          );
          if (index !== -1) {
            Vue.set(state.game.enemySquad.units, index, {
              ...state.game.enemySquad.units[index],
              ...updateEntry
            });
          }
        });
      }

      if (data.initiativeRating !== undefined) {
        state.game.initiativeRating = data.initiativeRating;
      }

      // Combat runtime
      if (data.combatStarted !== undefined) {
        state.game.combat.started = data.combatStarted;
      }
      if (data.activeFighterId !== undefined) {
        state.game.combat.activeFighterId = data.activeFighterId;
      }
      if (data.combatResult !== undefined) {
        state.game.combat.result = data.combatResult;
      }
      if (data.combatMoveCells !== undefined) {
        state.game.combat.runtime.moveCells = data.combatMoveCells;
      }
      if (data.combatAttackCells !== undefined) {
        state.game.combat.runtime.attackCells = data.combatAttackCells;
      }
      if (data.combatTargetCells !== undefined) {
        state.game.combat.runtime.targetCells = data.combatTargetCells;
      }
      if (data.effects !== undefined) {
        state.game.combat.runtime.queue = data.effects || [];
      }
    },
    setInitialState(state, data) {
      state.loaded = true;

      const userData = data.user;
      state.user.balance = userData.balance;
      state.user.timers = userData.timers;
      state.user.rewards = userData.rewards;
      state.user.adventures = userData.adventures;

      state.inventory = data.inventory;

      const gameData = data.game;
      state.game.mode = gameData.mode;
      state.game.room = gameData.room;
      state.game.level = gameData.level;
      state.game.difficulty = gameData.difficulty;
      state.game.adventureDifficulty = gameData.adventureDifficulty;
      state.game.userSquad = gameData.userSquad;
      state.game.enemySquad = gameData.enemySquad;
      if (gameData.terrain) {
        state.game.terrain = gameData.terrain;
      }

      const combatData = gameData.combat;
      state.game.combat.started = combatData.started;
      state.game.combat.result = combatData.result;
      state.game.combat.isMyTurn = combatData.isMyTurn;
      state.game.combat.activeFighterId = combatData.activeFighterId;
      state.game.combat.runtime.selectedAbilityClass =
        combatData.runtime.selectedAbilityClass;
      state.game.combat.runtime.moveCells = combatData.runtime.moveCells;
      state.game.combat.runtime.attackCells = combatData.runtime.attackCells;
      state.game.combat.runtime.targetCells = combatData.runtime.targetCells;
    }
  },
  actions: {
    update(store, data) {
      store.commit("updateState", data);
    },
    subscribe(store) {
      store.state.hasSubscribed = true;
      this.$app.$game.onNetwork(Events.BattleUpdate, data => {
        store.dispatch("update", data);
      });
    },
    unsubscribe(store) {
      store.state.hasSubscribed = false;
      this.$app.$game.offNetwork(Events.BattleUpdate);
    },
    setTiersFilter(store, data) {
      store.state.selectedTiersFilter = data;
      localStorage.setItem(BATTLE_TIERS_FILTER, JSON.stringify(data));
    },
    setClassesFilter(store, data) {
      store.state.selectedClassesFilter = data;
      localStorage.setItem(BATTLE_CLASSES_FILTER, JSON.stringify(data));
    },

    // ###### OPERATIONS ######
    // BattleLoad
    async load(store) {
      let result = await this.$app.$game._wrapOperation(Operations.BattleLoad);
      store.commit("setInitialState", result.response);
    },

    // BattleClaimReward
    // - type: REWARD_TYPE_DAILY | REWARD_TYPE_RANKING
    async claimReward(store, { type }) {
      /*Vue.prototype.$app.logEvent("april-claim-reward", {
        type
      });*/
      return (
        await this.$app.$game._wrapOperation(Operations.BattleClaimReward, {
          type
        })
      ).response;
    },

    // BattlePurchase
    // - commodity: COMMODITY_ENERGY | COMMODITY_COINS | COMMODITY_CRYSTALS | COMMODITY_CHEST
    // - currency: flesh | shinees | COMMODITY_COINS
    // - shopIndex: number
    async purchase(store, { commodity, currency, shopIndex }) {
      /*Vue.prototype.$app.logEvent("april-buy-hero", {
        hero: heroClass
      });*/
      await this.$app.$game._wrapOperation(Operations.BattlePurchase, {
        commodity,
        currency,
        shopIndex
      });
    },

    // TODO:
    // BattleOpenChest

    // BattleFillSquadSlot
    async fillSquadSlot(store, { unitId, index }) {
      await this.$app.$game._wrapOperation(Operations.BattleFillSquadSlot, {
        unitId,
        index
      });
    },

    // BattleClearSquadSlot
    async clearSquadSlot(store, { index }) {
      await this.$app.$game._wrapOperation(Operations.BattleClearSquadSlot, {
        index
      });
    },

    // BattleUpgradeUnitLevel
    async upgradeUnitLevel(store, { unitId }) {
      await this.$app.$game._wrapOperation(Operations.BattleUpgradeUnitLevel, {
        unitId
      });
    },

    // BattleUpgradeUnitAbility
    async upgradeUnitAbility(store, { unitId, ability }) {
      await this.$app.$game._wrapOperation(
        Operations.BattleUpgradeUnitAbility,
        {
          unitId,
          ability
        }
      );
    },

    // BattleMergeUnits

    // BattleChooseAbility - Choose ability
    // - abilityClass: string
    async chooseAbility(store, { abilityClass }) {
      //store.commit("setIsDisabled", true);
      await this.$app.$game._wrapOperation(Operations.BattleChooseAbility, {
        abilityClass
      });
      /*store.commit("setSelectedCardId", null);
      setTimeout(() => {
        store.commit("setIsDisabled", false);
      }, 1000);*/
    },

    // BattleApply - Move to / Atack a cell
    // - index: number|null
    // - ability: string|null - Need in case of enemy at the cell
    async apply(store, { index, ability }) {
      //store.commit("setIsDisabled", true);
      await this.$app.$game._wrapOperation(Operations.BattleApply, {
        index: index === undefined ? null : index, // NOT UNDEFINED!!!
        ability: ability === undefined ? null : ability // NOT UNDEFINED!!!
      });
      /*store.commit("setSelectedCardId", null);
      setTimeout(() => {
        store.commit("setIsDisabled", false);
      }, 1000);*/
    },

    // BattleSkip - Skip a turn
    async skip() {
      /*Vue.prototype.$app.logEvent("april-skip-turn", {
        level: store.state ? store.state.level : 1
      });
      store.commit("setIsDisabled", true);*/
      await this.$app.$game._wrapOperation(Operations.BattleSkip);
      /*store.commit("setSelectedCardId", null);
      setTimeout(() => {
        store.commit("setIsDisabled", false);
      }, 1000);*/
    },

    // BattleEnterLevel - Start from level > 1
    // - room: number
    // - level: number
    async enterLevel(store, { room, level }) {
      /*Vue.prototype.$app.logEvent("april-next-lvl", {
        level: store.state.level + 1,
        booster
      });*/
      await this.$app.$game._wrapOperation(Operations.BattleEnterLevel, {
        room,
        level
      });
      //store.commit("setIsDisabled", false);
    },

    // BattleFetchDuelOptions
    async fetchDuelOptions() {
      return (
        await this.$app.$game._wrapOperation(Operations.BattleFetchDuelOptions)
      ).response;
    },

    // BattleEnterDuel
    // - difficulty: GAME_DIFFICULTY_LOW | GAME_DIFFICULTY_MEDIUM | GAME_DIFFICULTY_HIGH
    async enterDuel(store, { difficulty }) {
      /*Vue.prototype.$app.logEvent("april-next-lvl", {
        level: store.state.level + 1,
        booster
      });*/
      await this.$app.$game._wrapOperation(Operations.BattleEnterDuel, {
        difficulty
      });
      //store.commit("setIsDisabled", false);
    },

    // BattleRankings
    async rankings() {
      return (await this.$app.$game._wrapOperation(Operations.BattleRankings))
        .response;
    },

    // BattleRestart - Restart current fight
    async restart() {
      //Vue.prototype.$app.logEvent("april-start", { hero: heroClass });
      await this.$app.$game._wrapOperation(Operations.BattleRestart);
      //store.commit("setIsDisabled", false);
    },

    // BattleExit - Exit playground
    async exit() {
      await this.$app.$game._wrapOperation(Operations.BattleExit);
    },

    // move fighter { fighterId, index, oldIndex }
    move(store, data) {
      if (
        store.getters.units.find(
          ({ fighterId }) => fighterId === data.fighterId
        )
      ) {
        store.commit("updateState", { userFighter: [data] });
      } else {
        store.commit("updateState", { enemyFighter: [data] });
      }
    },

    // BattleTestAction
    async testAction(store, data) {
      await this.$app.$game._wrapOperation(Operations.BattleTestAction, data); // { action: ... }
    }
  }
};

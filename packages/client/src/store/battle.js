import Vue from "vue";
import * as battle from "@/../../knightlands-shared/battle";
import Events from "@/../../knightlands-shared/events";
import Operations from "@/../../knightlands-shared/operations";
import {
  SHOP_STARTER_PACK,
  SHOP_DAILY_REWARD,
  SHOP_ENERGY_CHEST,
  SHOP_COIN_CHEST
} from "@/../../knightlands-shared/battle";

const BATTLE_TIERS_FILTER = "BATTLE_TIERS_FILTER";
const BATTLE_CLASSES_FILTER = "BATTLE_CLASSES_FILTER";
const BATTLE_TRIBES_FILTER = "BATTLE_TRIBES_FILTER";

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
let selectedTribesFilter = [];
if (localStorage.getItem(BATTLE_TRIBES_FILTER)) {
  selectedTribesFilter = JSON.parse(localStorage.getItem(BATTLE_TRIBES_FILTER));
}

export default {
  namespaced: true,
  state: {
    // @todo: set to false
    loaded: false,
    selectedTiersFilter,
    selectedClassesFilter,
    selectedTribesFilter,
    hasSubscribed: false,
    // hasShownDailyRewards: false,
    mergerIds: [null, null, null],
    fighterOrders: [],

    // User data
    user: {
      pvpScore: 0,
      balance: {
        energy: 0,
        coins: 0, // Source: PvE, Purpose: upgrade units level
        crystals: 0, // Source: PvP, Purpose: upgrade abilities level
        pvpScore: 0
      },
      items: [], // Example: [{ id: 8, quantity: 1 }] - starter pack
      counters: {
        energy: 0,
        purchase: {},
        duels: {}
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
        squadRewards: [
          // {
          //   tribe: battle.UNIT_TRIBE_TITAN,
          //   activeTemplates: [224, 227, 230, 233, 236],
          //   canClaim: true
          // },
          // {
          //   tribe: battle.UNIT_TRIBE_LEGENDARY,
          //   activeTemplates: [209, 212, 215, 218, 221],
          //   canClaim: true
          // },
          // {
          //   tribe: battle.UNIT_TRIBE_FALLEN_KING,
          //   activeTemplates: [194, 197, 200, 203, 206],
          //   canClaim: false
          // }
        ]
      },
      shop: {
        [SHOP_STARTER_PACK]: { left: 1 },
        [SHOP_DAILY_REWARD]: { left: 2 },
        [SHOP_ENERGY_CHEST]: { left: 6 },
        [SHOP_COIN_CHEST]: { left: 2 }
      }
    },

    // 6 rooms
    adventures: {
      difficulty: battle.GAME_DIFFICULTY_MEDIUM,
      location: null,
      level: null,
      locations: [
        /*
        {
          levels: [
            {
              [GAME_DIFFICULTY_MEDIUM]: false,
              [GAME_DIFFICULTY_HIGH]: false
            }
          ]
        }
        */
      ]
    },

    // Unit list data
    inventory: [],

    // Game
    game: {
      mode: null, // string|null: GAME_MODE_DUEL | GAME_MODE_ADVENTURE
      location: null, // number|null: 0-7
      level: null, // number|null: 0-5
      difficulty: null, // string: GAME_DIFFICULTY_LOW | GAME_DIFFICULTY_MEDIUM | GAME_DIFFICULTY_HIGH
      usedActions: [],

      // User squad
      userSquad: {
        power: 0,
        bonuses: [],
        fighters: []
      },

      // Enemy squad
      enemySquad: {
        power: 0,
        bonuses: [],
        fighters: []
      },

      // Terrain
      terrain: null,

      // Active combat's data
      combat: {
        started: false,
        rewards: {
          coins: 0,
          crystals: 0,
          xp: 0,
          rank: 0
        },
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
    // dailyRewards(state) {
    //   return state.user && state.user.rewards
    //     ? state.user.rewards.dailyRewards || []
    //     : [];
    // },
    squadRewards(state) {
      return state.user && state.user.rewards
        ? state.user.rewards.squadRewards || []
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
    fighters(state) {
      return (state.game && state.game.userSquad
        ? state.game.userSquad.fighters || []
        : []
      ).filter(Boolean);
    },
    mergerUnits(state) {
      return state.mergerIds.map(id => {
        if (!id) {
          return null;
        }

        const unit = state.inventory.find(
          ({ unitId }) => unitId && unitId === id
        );

        if (!(unit && unit.quantity >= 3)) {
          return null;
        }

        // let duplicatedCount = 0;

        // for (let i = 0; i < index; i++) {
        //   if (state.mergerIds[i] === id) {
        //     duplicatedCount++;
        //   }
        // }

        // if (duplicatedCount >= unit.quantity) {
        //   return null;
        // }

        return unit;
      });
    },
    isFightersFullFilled(state, getters) {
      return getters.fighters.filter(u => u).length >= 2;
    },
    activeFighterId(state) {
      return state.game.combat.activeFighterId;
    },
    isMyTurn(state, getters) {
      return !!(
        getters.activeFighterId &&
        getters.fighters &&
        getters.fighters.find(
          fighter => fighter && fighter.fighterId === getters.activeFighterId
        )
      );
    },
    moveCells(state) {
      // if (!getters.isMyTurn) {
      //   return [];
      // }
      return state.game && state.game.combat && state.game.combat.runtime
        ? state.game.combat.runtime.moveCells || []
        : [];
    },
    attackCells(state) {
      // if (!getters.isMyTurn) {
      //   return [];
      // }
      return state.game && state.game.combat && state.game.combat.runtime
        ? state.game.combat.runtime.attackCells || []
        : [];
    },
    targetCells(state) {
      return state.game && state.game.combat && state.game.combat.runtime
        ? state.game.combat.runtime.targetCells || []
        : [];
    },
    enemyFighters(state) {
      return (state.game && state.game.enemySquad
        ? state.game.enemySquad.fighters || []
        : []
      ).filter(Boolean);
    },
    // TODO unit > fighter
    // enemySelectedUnitId(state, getters) {
    //   if (getters.isMyTurn) {
    //     return null;
    //   }
    //   return state.game && state.game.combat && state.game.combat.runtime
    //     ? state.game.combat.runtime.unitId
    //     : null;
    // },
    // TODO unit > fighter
    // enemySelectedUnit(state, getters) {
    //   if (!getters.enemySelectedUnitId) {
    //     return null;
    //   }

    //   return getters.enemyFighters.find(
    //     ({ unitId }) => unitId === getters.enemySelectedUnitId
    //   );
    // },
    enemyMoveCells(state) {
      // if (getters.isMyTurn) {
      //   return [];
      // }
      return state.game && state.game.combat && state.game.combat.runtime
        ? state.game.combat.runtime.moveCells || []
        : [];
    },
    enemyAttackCells(state) {
      // if (getters.isMyTurn) {
      //   return [];
      // }
      return state.game && state.game.combat && state.game.combat.runtime
        ? state.game.combat.runtime.attackCells || []
        : [];
    },
    totalPower(state) {
      return state.inventory.reduce((prev, unit) => prev + unit.power, 0);
    }
  },
  mutations: {
    updateState(state, data) {
      // if (data.hasShownDailyRewards !== undefined) {
      //   state.hasShownDailyRewards = !!data.hasShownDailyRewards;
      // }

      if (data.mergerIds !== undefined) {
        state.mergerIds = data.mergerIds;
      }

      // Adventures
      if (data.adventures !== undefined) {
        state.adventures.difficulty = data.adventures.difficulty;
        state.adventures.location = data.adventures.location;
        state.adventures.level = data.adventures.level;

        if (data.adventures.locations) {
          state.adventures.locations = data.adventures.locations;
        }
      }

      // Add an inventory unit
      if (data.addUnit !== undefined) {
        state.inventory.push(...data.addUnit);
      }
      if (data.removeUnit !== undefined) {
        const index = state.inventory.findIndex(
          unit => unit.template === data.removeUnit
        );
        Vue.delete(state.inventory, index);
      }

      if (data.updateUnit !== undefined) {
        for (let unitId in data.updateUnit) {
          const index = state.inventory.findIndex(
            unit => unit.unitId === unitId
          );
          if (index !== -1) {
            Vue.set(state.inventory, index, data.updateUnit[unitId]);
          }
        }
      }

      // Reset an inventory
      if (data.inventory !== undefined) {
        state.inventory = data.inventory;
      }

      // User data
      if (data.pvpScore !== undefined) {
        state.user.pvpScore = data.pvpScore;
      }
      if (data.balance !== undefined) {
        state.user.balance = { ...state.balance, ...data.balance };
      }
      if (data.counters !== undefined) {
        state.user.counters = { ...state.user.counters, ...data.counters };
      }
      if (data.items !== undefined) {
        state.user.items = data.items;
      }
      if (data.squadRewards !== undefined) {
        state.user.rewards.squadRewards = data.squadRewards;
      }

      // Game data
      if (data.mode !== undefined) {
        state.game.mode = data.mode;
      }
      if (data.location !== undefined) {
        state.game.location = data.location;
      }
      if (data.level !== undefined) {
        state.game.level = data.level;
      }
      if (data.difficulty !== undefined) {
        state.game.difficulty = data.difficulty;
      }
      if (data.usedActions !== undefined) {
        if (data.usedActions.length > 0) {
          state.game.usedActions = [
            ...state.game.usedActions,
            ...data.usedActions
          ];
        } else {
          state.game.usedActions = [];
        }
      }

      // Set a whole user/enemy squad.
      // Will be called only while in a lobby.
      // Not for a combat.
      if (data.userSquad !== undefined) {
        state.game.userSquad.power = data.userSquad.power;
        state.game.userSquad.bonuses = data.userSquad.bonuses;
        state.game.userSquad.fighters = data.userSquad.fighters;
      }
      if (data.enemySquad !== undefined) {
        state.game.enemySquad.power = data.enemySquad.power;
        state.game.enemySquad.bonuses = data.enemySquad.bonuses;
        state.game.enemySquad.fighters = data.enemySquad.fighters;
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
          let index = state.game.userSquad.fighters.findIndex(
            fighter => fighter && fighter.fighterId === fighterId
          );

          if (index !== -1) {
            Vue.set(
              state.game.userSquad.fighters[index],
              "buffs",
              data.buffs[fighterId]
            );
          }

          // Enemy squad
          index = state.game.enemySquad.fighters.findIndex(
            fighter => fighter && fighter.fighterId === fighterId
          );

          if (index !== -1) {
            Vue.set(
              state.game.enemySquad.fighters[index],
              "buffs",
              data.buffs[fighterId]
            );
          }
        }
      }

      if (data.abilities !== undefined) {
        for (let fighterId in data.abilities) {
          // User squad
          let index = state.game.userSquad.fighters.findIndex(
            fighter => fighter && fighter.fighterId === fighterId
          );

          if (index !== -1) {
            Vue.set(
              state.game.userSquad.fighters[index],
              "abilities",
              data.abilities[fighterId]
            );
          }

          // Enemy squad
          index = state.game.enemySquad.fighters.findIndex(
            fighter => fighter && fighter.fighterId === fighterId
          );

          if (index !== -1) {
            Vue.set(
              state.game.enemySquad.fighters[index],
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
          const index = state.game.userSquad.fighters.findIndex(
            fighter => fighter && fighter.fighterId === updateEntry.fighterId
          );

          if (index !== -1) {
            const fighter = state.game.userSquad.fighters[index];
            const oldIndex = fighter.index;
            Vue.set(state.game.userSquad.fighters, index, {
              ...fighter,
              ...updateEntry,
              ...(oldIndex !== updateEntry.index ? { oldIndex } : {})
            });
          }
        });
      }

      // Array of unit updates during the combat
      // Could be updated: index, hp, abilities, buffs
      if (data.enemyFighter !== undefined) {
        data.enemyFighter.forEach(updateEntry => {
          const index = state.game.enemySquad.fighters.findIndex(
            fighter => fighter && fighter.fighterId === updateEntry.fighterId
          );
          if (index !== -1) {
            const fighter = state.game.enemySquad.fighters[index];
            const oldIndex = fighter.index;
            Vue.set(state.game.enemySquad.fighters, index, {
              ...fighter,
              ...updateEntry,
              ...(oldIndex !== updateEntry.index ? { oldIndex } : {})
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
        if (data.combatStarted) {
          state.fighterOrders = [];
        }
      }
      if (data.activeFighterId !== undefined) {
        state.game.combat.activeFighterId = data.activeFighterId;
        // Update fighters' order
        let fighterOrders = [...state.fighterOrders];
        if (!(fighterOrders.length > 0)) {
          fighterOrders = [
            ...(state.game && state.game.userSquad
              ? state.game.userSquad.fighters || []
              : []
            ).filter(Boolean),
            ...(state.game && state.game.enemySquad
              ? state.game.enemySquad.fighters || []
              : []
            ).filter(Boolean)
          ]
            .sort((a, b) => {
              if (a.ratingIndex < b.ratingIndex) {
                return -1;
              }

              if (a.ratingIndex > b.ratingIndex) {
                return 1;
              }

              return 0;
            })
            .map(({ fighterId }) => fighterId);
        }
        fighterOrders.unshift(data.activeFighterId);
        state.fighterOrders = fighterOrders.filter((value, index, self) => {
          return self.indexOf(value) === index;
        });
      }
      if (data.combatResult !== undefined) {
        state.game.combat.result = data.combatResult;
      }
      if (data.combatRewards !== undefined) {
        state.game.combat.rewards = data.combatRewards;
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

      state.adventures = data.adventures;

      const userData = data.user;
      state.user.balance = userData.balance;
      state.user.counters = userData.counters;
      state.user.rewards = userData.rewards;
      state.user.items = userData.items;
      state.user.pvpScore = userData.pvpScore;

      state.inventory = data.inventory;

      const gameData = data.game;
      state.game.mode = gameData.mode;
      state.game.location = gameData.location;
      state.game.level = gameData.level;
      state.game.difficulty = gameData.difficulty;
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
    setTribesFilter(store, data) {
      store.state.selectedTribesFilter = data;
      localStorage.setItem(BATTLE_TRIBES_FILTER, JSON.stringify(data));
    },

    // ###### OPERATIONS ######
    // BattleLoad
    async load(store) {
      let result = await this.$app.$game._wrapOperation(Operations.BattleLoad);
      store.commit("setInitialState", result.response);
    },

    // BattleClaimReward
    // - type: REWARD_TYPE_DAILY | REWARD_TYPE_RANKING
    async claimReward(store, { type, tribe }) {
      /*Vue.prototype.$app.logEvent("april-claim-reward", {
        type
      });*/
      return (
        await this.$app.$game._wrapOperation(Operations.BattleClaimReward, {
          type,
          tribe
        })
      ).response;
    },

    // BattlePurchase
    // - id: number
    async purchase(store, { id, tribe }) {
      /*Vue.prototype.$app.logEvent("april-buy-hero", {
        hero: heroClass
      });*/
      return (
        await this.$app.$game._wrapOperation(Operations.BattlePurchase, {
          id,
          tribe
        })
      ).response;
    },

    // TODO:
    // BattleOpenChest

    // BattleSetAdventuresDifficulty
    async setAdventuresDifficulty(store, { difficulty }) {
      await this.$app.$game._wrapOperation(
        Operations.BattleSetAdventuresDifficulty,
        {
          difficulty
        }
      );
    },

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

    // BattleMerge
    chooseMergerUnit(store, { unitId }) {
      store.dispatch("update", { mergerIds: [unitId, unitId, unitId] });
    },
    clearMergeUnits(store) {
      store.dispatch("update", { mergerIds: [null, null, null] });
    },
    async mergeUnits(store) {
      const response = (
        await this.$app.$game._wrapOperation(Operations.BattleMerge, {
          template: store.getters.mergerUnits[0].template
        })
      ).response;
      store.dispatch("clearMergeUnits");
      return response;
    },

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
    // - location: number
    // - level: number
    async enterLevel(store, { location, level }) {
      /*Vue.prototype.$app.logEvent("april-next-lvl", {
        level: store.state.level + 1,
        booster
      });*/
      await this.$app.$game._wrapOperation(Operations.BattleEnterLevel, {
        location,
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
    async rankings(store, { mode }) {
      return (
        await this.$app.$game._wrapOperation(Operations.BattleRankings, {
          mode
        })
      ).response;
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
        store.getters.fighters.find(
          fighter => fighter && fighter.fighterId === data.fighterId
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

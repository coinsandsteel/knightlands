import _ from "lodash";
import Vue from "vue";
import * as battle from "@/../../knightlands-shared/battle";
import Events from "@/../../knightlands-shared/events";
import Operations from "@/../../knightlands-shared/operations";
import {
  GAME_DIFFICULTY_HIGH,
  GAME_DIFFICULTY_MEDIUM
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

const inventoryUnit = {
  unitId: "2c8vny4t9",
  unitTribe: battle.UNIT_TRIBE_ORC, // 15 tribes #meta
  unitClass: battle.UNIT_CLASS_MELEE, // 5 classes #meta
  tier: 1, // 3 tiers; modify via merger (3 => 1)
  level: {
    // 15 levels; // exp > max limit > pay coins > lvl up > characteristics auto-upgrade
    current: 1, // Current level
    next: 2, // If not null - upgrade is available
    price: 999 // Upgrade price, ancient coins
  },
  power: 5,
  experience: {
    percentage: 17,
    currentLevelExp: 170,
    nextLevelExp: 1000
  },
  characteristics: {
    hp: 10,
    damage: 3,
    defence: 7,
    initiative: 1,
    speed: 4
  },
  abilities: [
    // #meta
    // Here will be all the abilities
    // flow: unit lvl opens ability lvl > pay crystal > lvl up
    {
      abilityClass: "axe_blow",
      abilityGroup: battle.ABILITY_GROUP_ATTACK,
      tier: 1,
      // canLearn: true,
      level: {
        // unit lvl opens ability lvl > pay crystal > lvl up
        current: 1, // 0 means "not learned"
        next: 2, // not null means "can learn"
        price: 99 // Learn price, crystals
      },
      value: -30
    },
    {
      abilityClass: "axe_blow2",
      abilityGroup: battle.ABILITY_GROUP_BUFF,
      tier: 2,
      // canLearn: false,
      level: {
        // unit lvl opens ability lvl > pay crystal > lvl up
        current: 0, // 0 means "not learned"
        next: 1, // not null means "can learn"
        price: 100 // Learn price, crystals
      },
      value: -30
    },
    {
      abilityClass: "axe_blow3",
      abilityGroup: battle.ABILITY_GROUP_DE_BUFF,
      tier: 3,
      // canLearn: false,
      level: {
        // unit lvl opens ability lvl > pay crystal > lvl up
        current: 0, // 0 means "not learned"
        next: null, // not null means "can learn"
        price: null // Learn price, crystals
      },
      value: -30
    }
  ],
  quantity: 3
};

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
      }
    },

    // Unit list data
    inventory: [
      /*_.cloneDeep(inventoryUnit),
      _.cloneDeep(inventoryUnit),
      _.cloneDeep(inventoryUnit),
      _.cloneDeep(inventoryUnit),
      _.cloneDeep(inventoryUnit),
      _.cloneDeep(inventoryUnit)*/
    ],

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
        bonuses: [{ bonusClass: "squad-increase-hp", delta: 2 }],
        units: [
          {
            unitId: "2c8vny4t9",
            unitTribe: battle.UNIT_TRIBE_ORC, // 15 tribes
            unitClass: battle.UNIT_CLASS_TANK, // 5 classes
            tier: 1, // 3 tiers; modify via merger (3 => 1)
            index: 32, // cell index 0-34
            hp: 10,
            abilities: [
              {
                abilityClass: "axe_blow",
                abilityGroup: battle.ABILITY_GROUP_ATTACK,
                tier: 1,
                cooldown: {
                  enabled: false,
                  stepsLeft: 0,
                  stepsMax: 3
                }
              }
            ],
            buffs: [] // Will be defined later
          },
          {
            unitId: "2c8vny4t1",
            unitTribe: battle.UNIT_TRIBE_ORC, // 15 tribes
            unitClass: battle.UNIT_CLASS_SUPPORT, // 5 classes
            tier: 1, // 3 tiers; modify via merger (3 => 1)
            index: 30, // cell index 0-34
            hp: 10,
            abilities: [
              {
                abilityClass: "axe_blow",
                abilityGroup: battle.ABILITY_GROUP_BUFF,
                tier: 1,
                cooldown: {
                  enabled: false,
                  stepsLeft: 0,
                  stepsMax: 3
                }
              }
            ],
            buffs: [] // Will be defined later
          }
        ]
      },

      // Enemy squad
      enemySquad: {
        power: 0,
        bonuses: [], // Probably, will be always empty
        units: []
      },

      // Terrain
      terrain: [
        /*{ terrainId: "45c43rv", terrainClass: battle.TERRAIN_GRASS, index: 0 },
        {
          terrainId: "v34vt34",
          terrainClass: battle.TERRAIN_GRASS_SWAMP,
          index: 1
        },
        {
          terrainId: "c4c435t",
          terrainClass: battle.TERRAIN_GRASS_WOODS,
          index: 2
        },
        { terrainId: "1", terrainClass: battle.TERRAIN_GRASS_HILL, index: 3 },
        { terrainId: "2", terrainClass: battle.TERRAIN_GRASS, index: 4 },
        { terrainId: "3", terrainClass: battle.TERRAIN_GRASS, index: 5 },
        {
          terrainId: "4",
          terrainClass: battle.TERRAIN_GRASS_SWAMP_X,
          index: 6
        },
        {
          terrainId: "5",
          terrainClass: battle.TERRAIN_GRASS_SWAMP_Y,
          index: 7
        },
        {
          terrainId: "6",
          terrainClass: battle.TERRAIN_GRASS_SWAMP_Y,
          index: 8
        },
        {
          terrainId: "7",
          terrainClass: battle.TERRAIN_GRASS_SWAMP_Z,
          index: 9
        },
        { terrainId: "8", terrainClass: battle.TERRAIN_GRASS, index: 10 },
        { terrainId: "8", terrainClass: battle.TERRAIN_GRASS, index: 11 },
        { terrainId: "9", terrainClass: battle.TERRAIN_GRASS, index: 12 },
        { terrainId: "10", terrainClass: battle.TERRAIN_GRASS, index: 13 },
        {
          terrainId: "11",
          terrainClass: battle.TERRAIN_GRASS_WOODS,
          index: 14
        },
        {
          terrainId: "12",
          terrainClass: battle.TERRAIN_GRASS_WOODS,
          index: 15
        },
        {
          terrainId: "13",
          terrainClass: battle.TERRAIN_GRASS_WOODS,
          index: 16
        },
        { terrainId: "14", terrainClass: battle.TERRAIN_GRASS, index: 17 },
        { terrainId: "15", terrainClass: battle.TERRAIN_GRASS, index: 18 },
        { terrainId: "16", terrainClass: battle.TERRAIN_GRASS, index: 19 },
        { terrainId: "17", terrainClass: battle.TERRAIN_GRASS, index: 20 },
        { terrainId: "18", terrainClass: battle.TERRAIN_GRASS, index: 21 },
        { terrainId: "19", terrainClass: battle.TERRAIN_GRASS, index: 22 },
        { terrainId: "20", terrainClass: battle.TERRAIN_GRASS, index: 23 },
        { terrainId: "21", terrainClass: battle.TERRAIN_GRASS, index: 24 },
        {
          terrainId: "22",
          terrainClass: battle.TERRAIN_GRASS_WOODS,
          index: 25
        },
        { terrainId: "23", terrainClass: battle.TERRAIN_GRASS, index: 26 },
        { terrainId: "24", terrainClass: battle.TERRAIN_GRASS, index: 27 },
        {
          terrainId: "25",
          terrainClass: battle.TERRAIN_GRASS_WOODS,
          index: 28
        },
        { terrainId: "26", terrainClass: battle.TERRAIN_GRASS, index: 29 },
        { terrainId: "27", terrainClass: battle.TERRAIN_GRASS, index: 30 },
        { terrainId: "28", terrainClass: battle.TERRAIN_GRASS, index: 31 },
        { terrainId: "29", terrainClass: battle.TERRAIN_GRASS, index: 32 },
        { terrainId: "30", terrainClass: battle.TERRAIN_GRASS, index: 33 },
        { terrainId: "31", terrainClass: battle.TERRAIN_GRASS, index: 34 }*/
      ],

      // Active combat's data
      combat: {
        started: false,
        result: null, // string|null: COMBAT_RESULT_WIN | COMBAT_RESULT_LOOSE
        // @todo: set to false
        isMyTurn: true, // boolean|null
        activeUnitId: null,
        runtime: {
          unitId: null, // string|null
          selectedIndex: null, // number|null
          selectedAbilityClass: null, // string|null
          moveCells: [], // number[]
          attackCells: [], // number[],
          queue: [
            // Unit moved
            /*{
              action: "move",
              unitId: "v4nv9",
              newIndex: 8
            },
            // Unit attack
            {
              action: battle.ABILITY_GROUP_ATTACK,
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
              action: battle.ABILITY_GROUP_BUFF,
              source: {
                unitId: "v4nasv9",
                index: 3
              },
              target: {
                unitId: "45v83tn",
                index: 20
              },
              ability: {
                abilityClass: battle.ABILITY_WIND_WALK,
                damage: 1
              }
            },
            // Unit debuff
            {
              action: battle.ABILITY_GROUP_DE_BUFF,
              source: {
                unitId: "v4nv9",
                index: 3
              },
              target: {
                unitId: "b5n48",
                index: 8
              },
              ability: {
                abilityClass: battle.ABILITY_CURSE,
                damage: 1
              }
            },
            // Unit self buff
            {
              action: battle.ABILITY_GROUP_SELF_BUFF,
              source: {
                unitId: "v4nv9",
                index: 3
              },
              ability: {
                abilityClass: battle.ABILITY_RAGE,
                damage: 0
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
    selectedIndex(state) {
      return state.game && state.game.combat && state.game.combat.runtime
        ? state.game.combat.runtime.selectedIndex
        : null;
    },
    isMyTurn(state) {
      return state.game && state.game.combat
        ? !!state.game.combat.isMyTurn
        : false;
    },
    units(state) {
      return (state.game && state.game.userSquad
        ? state.game.userSquad.units || []
        : []
      ).filter(Boolean);
    },
    selectedUnitId(state, getters) {
      if (!getters.isMyTurn) {
        return null;
      }
      return state.game && state.game.combat && state.game.combat.runtime
        ? state.game.combat.runtime.unitId
        : null;
    },
    selectedUnit(state, getters) {
      if (!getters.selectedUnitId) {
        return null;
      }

      return getters.units.find(
        ({ unitId }) => unitId === getters.selectedUnitId
      );
    },
    moveCells(state, getters) {
      if (!getters.isMyTurn) {
        return [];
      }
      return state.game && state.game.combat && state.game.combat.runtime
        ? state.game.combat.runtime.moveCells || []
        : [];
    },
    attackCells(state, getters) {
      if (!getters.isMyTurn) {
        return [];
      }
      return state.game && state.game.combat && state.game.combat.runtime
        ? state.game.combat.runtime.attackCells || []
        : [];
    },
    enemyUnits(state) {
      return (state.game && state.game.enemySquad
        ? state.game.enemySquad.units || []
        : []
      ).filter(Boolean);
    },
    enemySelectedUnitId(state, getters) {
      if (getters.isMyTurn) {
        return null;
      }
      return state.game && state.game.combat && state.game.combat.runtime
        ? state.game.combat.runtime.unitId
        : null;
    },
    enemySelectedUnit(state, getters) {
      if (!getters.enemySelectedUnitId) {
        return null;
      }

      return getters.enemyUnits.find(
        ({ unitId }) => unitId === getters.enemySelectedUnitId
      );
    },
    enemyMoveCells(state, getters) {
      if (getters.isMyTurn) {
        return [];
      }
      return state.game && state.game.combat && state.game.combat.runtime
        ? state.game.combat.runtime.moveCells || []
        : [];
    },
    enemyAttackCells(state, getters) {
      if (getters.isMyTurn) {
        return [];
      }
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
        state.inventory.push(data.addUnit);
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

      // Array of unit updates during the combat
      // Could be updated: index, hp, abilities, buffs
      if (data.userSquadUnit !== undefined) {
        data.userSquadUnit.forEach(updateEntry => {
          const index = state.game.userSquad.units.findIndex(
            unit => unit.unitId === updateEntry.unitId
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
      if (data.enemySquadUnit !== undefined) {
        data.enemySquadUnit.forEach(updateEntry => {
          const index = state.game.enemySquad.units.findIndex(
            unit => unit.unitId === updateEntry.unitId
          );
          if (index !== -1) {
            Vue.set(state.game.enemySquad.units, index, {
              ...state.game.enemySquad.units[index],
              ...updateEntry
            });
          }
        });
      }

      // Combat runtime
      if (data.combatStarted !== undefined) {
        state.game.combat.started = data.combatStarted;
      }
      if (data.activeUnitId !== undefined) {
        state.game.combat.activeUnitId = data.activeUnitId;
      }
      if (data.combatResult !== undefined) {
        state.game.combat.result = data.combatResult;
      }
      if (data.combatMoveCells !== undefined) {
        state.game.combat.runtime.moveCells = data.combat.moveCells;
      }
      if (data.combatAttackCells !== undefined) {
        state.game.combat.runtime.attackCells = data.combat.attackCells;
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
      if (gameData.terrain && gameData.terrain.length > 0) {
        state.game.terrain = gameData.terrain;
      }

      const combatData = gameData.combat;
      state.game.combat.started = combatData.started;
      state.game.combat.result = combatData.result;
      state.game.combat.isMyTurn = combatData.isMyTurn;
      state.game.combat.activeUnitId = combatData.activeUnitId;
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

    // BattleApply - Move to / Atack a cell
    // - unitId: string
    // - index: number
    // - ability?: string - Need in case of enemy at the cell
    async apply(store, { unitId, index, ability }) {
      //store.commit("setIsDisabled", true);
      await this.$app.$game._wrapOperation(Operations.BattleApply, {
        unitId,
        index,
        ability
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

    // update unit index
    move(store, { unitId, index }) {
      // @todo: check unit belongs to user or enemy
      store.commit("updateState", { userSquadUnit: [{ unitId, index }] });
    },

    // BattleTestAction
    async testAction(store, data) {
      await this.$app.$game._wrapOperation(Operations.BattleTestAction, data); // { action: ... }
    }
  }
};

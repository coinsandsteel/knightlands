// import Vue from "vue";
import * as battle from "@/../../knightlands-shared/battle";
import Events from "@/../../knightlands-shared/events";
import Operations from "@/../../knightlands-shared/operations";

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
    loaded: true,
    selectedTiersFilter,
    selectedClassesFilter,

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
          {
            collected: true,
            quantity: 1,
            active: true,
            date: "123"
          },
          {
            collected: false,
            quantity: 1,
            active: false
          }
        ],
        rankingRewards: [
          // Will be later
        ]
      }
    },

    // Unit list data
    inventory: [
      {
        unitId: "2c8vny4t9",
        unitTribe: battle.UNIT_TRIBE_ORC, // 15 tribes
        unitClass: battle.UNIT_CLASS_MELEE, // 5 classes
        tier: 1, // 3 tiers; modify via merger (3 => 1)
        level: 1, // 15 levels; // exp > max limit > pay coins > lvl up > characteristics auto-upgrade
        power: 5,
        experience: {
          current: 100, // gained value (relative)
          max: 10000 // full value (relative)
        },
        characteristics: {
          hp: 10,
          damage: 3,
          defence: 7,
          initiative: 1,
          speed: 4
        },
        abilities: [
          // Here will be all the abilities
          // flow: unit lvl opens ability lvl > pay crystal > lvl up
          {
            abilityClass: "axe_blow",
            abilityGroup: battle.ABILITY_GROUP_ATTACK,
            canLearn: true,
            level: 1 // 1-4
          }
        ],
        quantity: 3
      },
      {
        unitId: "2c8vny4t1",
        unitTribe: "ork", // 15 tribes
        unitClass: "range", // 5 classes
        tier: 2, // 3 tiers; modify via merger (3 => 1)
        level: 1, // 15 levels; // exp > max limit > pay coins > lvl up > characteristics auto-upgrade
        power: 5,
        experience: {
          current: 100, // gained value (relative)
          max: 10000 // full value (relative)
        },
        characteristics: {
          hp: 10,
          damage: 3,
          defence: 7,
          initiative: 1,
          speed: 4
        },
        abilities: [
          // Here will be all the abilities
          // flow: unit lvl opens ability lvl > pay crystal > lvl up
          {
            abilityClass: "axe_blow",
            abilityGroup: battle.ABILITY_GROUP_ATTACK,
            canLearn: true,
            level: 1 // 1-4
          }
        ],
        quantity: 3
      },
      {
        unitId: "2c8vny4t2",
        unitTribe: "ork", // 15 tribes
        unitClass: "mage", // 5 classes
        tier: 3, // 3 tiers; modify via merger (3 => 1)
        level: 1, // 15 levels; // exp > max limit > pay coins > lvl up > characteristics auto-upgrade
        power: 5,
        experience: {
          current: 100, // gained value (relative)
          max: 10000 // full value (relative)
        },
        characteristics: {
          hp: 10,
          damage: 3,
          defence: 7,
          initiative: 1,
          speed: 4
        },
        abilities: [
          // Here will be all the abilities
          // flow: unit lvl opens ability lvl > pay crystal > lvl up
          {
            abilityClass: "axe_blow",
            abilityGroup: battle.ABILITY_GROUP_ATTACK,
            canLearn: true,
            level: 1 // 1-4
          },
          {
            abilityClass: "axe_blow",
            abilityGroup: battle.ABILITY_GROUP_ATTACK,
            canLearn: true,
            level: 1 // 1-4
          }
        ],
        quantity: 3
      },
      {
        unitId: "2c8vny4t3",
        unitTribe: "ork", // 15 tribes
        unitClass: "tank", // 5 classes
        tier: 1, // 3 tiers; modify via merger (3 => 1)
        level: 1, // 15 levels; // exp > max limit > pay coins > lvl up > characteristics auto-upgrade
        power: 5,
        experience: {
          current: 100, // gained value (relative)
          max: 10000 // full value (relative)
        },
        characteristics: {
          hp: 10,
          damage: 3,
          defence: 7,
          initiative: 1,
          speed: 4
        },
        abilities: [
          // Here will be all the abilities
          // flow: unit lvl opens ability lvl > pay crystal > lvl up
          {
            abilityClass: "axe_blow",
            abilityGroup: battle.ABILITY_GROUP_ATTACK,
            canLearn: true,
            level: 1 // 1-4
          },
          {
            abilityClass: "axe_blow",
            abilityGroup: battle.ABILITY_GROUP_ATTACK,
            canLearn: true,
            level: 1 // 1-4
          }
        ],
        quantity: 3
      },
      {
        unitId: "2c8vny4t4",
        unitTribe: "ork", // 15 tribes
        unitClass: "support", // 5 classes
        tier: 1, // 3 tiers; modify via merger (3 => 1)
        level: 1, // 15 levels; // exp > max limit > pay coins > lvl up > characteristics auto-upgrade
        power: 5,
        experience: {
          current: 100, // gained value (relative)
          max: 10000 // full value (relative)
        },
        characteristics: {
          hp: 10,
          damage: 3,
          defence: 7,
          initiative: 1,
          speed: 4
        },
        abilities: [
          // Here will be all the abilities
          // flow: unit lvl opens ability lvl > pay crystal > lvl up
          {
            abilityClass: "axe_blow",
            abilityGroup: battle.ABILITY_GROUP_ATTACK,
            canLearn: true,
            level: 1 // 1-4
          },
          {
            abilityClass: "axe_blow",
            abilityGroup: battle.ABILITY_GROUP_DE_BUFF,
            canLearn: false,
            level: 0 // It's locked, yet
          }
        ],
        quantity: 3
      }
    ],

    // Game
    game: {
      mode: null, // string|null: GAME_MODE_DUEL | GAME_MODE_ADVENTURE
      room: null, // number|null: 0-7
      level: null, // number|null: 0-5
      difficulty: null, // string: GAME_DIFFICULTY_LOW | GAME_DIFFICULTY_MEDIUM | GAME_DIFFICULTY_HIGH

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
                abilityGroup: battle.ABILITY_GROUP_BUFF,
                cooldown: {
                  enabled: false,
                  stepsLeft: 0,
                  stepsMax: 3
                }
              }
            ],
            activeBuffs: [] // Will be defined later
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
                cooldown: {
                  enabled: false,
                  stepsLeft: 0,
                  stepsMax: 3
                }
              }
            ],
            activeBuffs: [] // Will be defined later
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
        { terrainClass: "forest-1", index: 4 },
        { terrainClass: "forest-2", index: 5 },
        { terrainClass: "forest-3", index: 6 }
      ],

      // Active combat's data
      combat: {
        started: false,
        result: null, // string|null: COMBAT_RESULT_WIN | COMBAT_RESULT_LOOSE
        // @todo: set to false
        isMyTurn: null, // boolean|null
        runtime: {
          unitId: null, // string|null
          slectedIndex: null, // number|null
          selectedAbilityClass: null, // string|null
          moveCells: [], // number[]
          attackCells: [] // number[]
        }
      }
    }
  },
  getters: {
    isMyTurn(state) {
      return state.isMyTurn;
    },
    units(state) {
      return state.units;
    },
    selectedUnitId(state) {
      return state.selectedUnitId;
    },
    selectedUnit(state, getters) {
      if (!state.selectedUnitId) {
        return null;
      }

      return getters.units.find(({ id }) => id === getters.selectedUnitId);
    },
    moveCells(state) {
      return state.moveCells;
    },
    enemyUnits(state) {
      return state.enemyUnits;
    },
    selectedEnemyId(state) {
      return state.selectedEnemyId;
    },
    selectedEnemy(state, getters) {
      if (!state.selectedEnemyId) {
        return null;
      }

      return getters.enemyUnits.find(
        ({ id }) => id === getters.selectedEnemyId
      );
    },
    enemyAvailableMoves(state) {
      return state.moveCells; // @todo
    }
  },
  mutations: {
    updateState(state, data) {
      if (data.isMyTurn !== undefined) {
        state.isMyTurn = data.isMyTurn;
      }
      if (data.selectedUnitId !== undefined) {
        state.selectedUnitId = data.selectedUnitId;
      }
      if (data.units !== undefined) {
        state.units = data.units;
      }
      if (data.moveCells !== undefined) {
        state.moveCells = data.moveCells;
      }
      if (data.selectedEnemyId !== undefined) {
        state.selectedEnemyId = data.selectedEnemyId;
      }
      if (data.enemyUnits !== undefined) {
        state.enemyUnits = data.enemyUnits;
      }
      // if (data.enemyAvailableMoves !== undefined) {
      //   state.enemyAvailableMoves = data.enemyAvailableMoves;
      // }
    },
    setInitialState(state, data) {
      state.loaded = true;
    }
  },
  actions: {
    update(store, data) {
      store.commit("updateState", data);
    },
    subscribe(store) {
      this.$app.$game.onNetwork(Events.BattleUpdate, data => {
        store.dispatch("update", data);
      });
    },
    unsubscribe() {
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

    // BattleMergeUnits
    // BattleUpgradeUnitLevel
    // BattleUpgradeUnitAbility
    // BattleUpgradeUnitAbility

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

    // BattleTestAction
    async testAction(store, action) {
      await this.$app.$game._wrapOperation(Operations.BattleTestAction, {
        action
      });
    }
  }
};

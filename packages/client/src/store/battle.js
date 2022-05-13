// import Vue from "vue";
// import * as battle from "@/../../knightlands-shared/battle";
import Events from "@/../../knightlands-shared/events";
import Operations from "@/../../knightlands-shared/operations";

export default {
  namespaced: true,
  state: {
    // @todo: set to false
    loaded: true,

    // User
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
    },

    // Game
    room: 1, // 8
    difficulty: 0, // 0, 1
    level: 1, // 5 + 1 boss
    // @todo: set to false
    isMyTurn: true,
    squad: {
      power: 0,
      bonus: [{ alias: "squad-increase-hp", delta: 2 }]
    },

    // Map
    // Player and enemy units
    units: [
      {
        id: "2c8vny4t9",
        unitClass: "damager", // 5
        // exp > max limit > pay coins > lvl up > attributes auto-upgrade
        level: 1, // 15
        tier: 1, // 3, modify via merger (3 => 1)
        power: 5,
        index: 32, // 0-34
        exp: 100,
        attributes: {
          hp: 10,
          damage: 3,
          defence: 7,
          initiative: 1,
          speed: 4
        }
      }
    ],

    enemyUnits: [
      {
        id: "2c8vny4t1",
        unitClass: "damager", // 5
        // exp > max limit > pay coins > lvl up > attributes auto-upgrade
        level: 1, // 15
        tier: 1, // 3, modify via merger (3 => 1)
        power: 5,
        index: 2, // 0-34
        exp: 100,
        attributes: {
          hp: 10,
          damage: 3,
          defence: 7,
          initiative: 1,
          speed: 4
        }
      }
    ],

    terrain: [
      { terrainClass: "forest-1", index: 4 },
      { terrainClass: "forest-2", index: 5 },
      { terrainClass: "forest-3", index: 6 }
    ],

    // Combat
    selectedUnitId: null,
    selectedEnemyId: null,
    moveCells: [0, 1, 2], // Choosed "move" action
    attackCells: [0, 1, 2], // Choosed ability
    abilities: [
      {
        unitId: "2c8vny4t9",
        abilityClass: "ability-1",
        // unit lvl opens ability lvl > pay crystal > lvl up
        level: 1, // 3-5
        power: {
          initial: 2,
          current: 3
        },
        cooldown: 0
      }
    ],
    buffs: [
      {
        unitId: "2c8vny4t9",
        abilityClass: "ability-1",
        buffClass: "increase-hp",
        delta: 2
      },
      {
        unitId: "2c8vny4t1",
        abilityClass: "ability-2",
        buffClass: "increase-hp",
        delta: 2
      }
    ]
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
    // BattleClearSquadSlot
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

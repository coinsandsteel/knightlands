import * as april from "@/../../knightlands-shared/april";

import Events from "@/../../knightlands-shared/events";
import Operations from "@/../../knightlands-shared/operations";

export default {
  namespaced: true,
  state: {
    loaded: true,
    round: 0, // 0 -> 8
    // User
    balance: {
      sessionGold: 0,
      gold: 0
    },
    preGameBoosters: {
      [april.BOOSTER_THIRD_ACTION]: 0,
      [april.BOOSTER_SKIP_A_TURN]: 0
    },
    selectedHeroIndex: 0,
    dailyRewards: [],
    // Playground
    stat: {
      // points: 0
    },
    sessionResult: null, // "win", "loose"
    hp: 3,
    actionPoints: 2,
    cells: [
      { damage: 1 },
      { damage: 1 },
      { damage: 1 },
      null,
      null,
  
      { damage: 1 },
      { damage: 1, enemy: april.UNIT_CLASS_TEETH, enemyId: "wer2s929f" },
      { damage: 2 },
      { damage: 2 },
      null,
  
      { damage: 1 },
      { damage: 2 },
      { damage: 2, enemy: april.UNIT_CLASS_TEETH, enemyId: "32vr45n7u6" },
      { damage: 1, enemy: april.UNIT_CLASS_JACK, enemyId: "89mnbv31x" },
      { damage: 1 },
  
      null,
      { damage: 1 },
      { damage: 1 },
      { damage: 2 },
      null,
  
      null,
      null,
      { damage: 0, hero: true },
      null,
      null
    ],
    deck: {
      queue: 5,
      current: [
        { cardClass: april.CARD_CLASS_PAWN, nextCells: [17] },
        { cardClass: april.CARD_CLASS_ROOK, nextCells: [12] },
        { cardClass: april.CARD_CLASS_PAWN, nextCells: [17] },
        { cardClass: april.CARD_CLASS_PAWN, nextCells: [17] }
      ],
      used: 0
    }
  },
  getters: {
    heroes() {
      return [
        { id: 1, name: "Knight", heroClass: april.HERO_CLASS_KNIGHT },
        { id: 2, name: "Paladin", heroClass: april.HERO_CLASS_PALADIN },
        { id: 3, name: "Rogue", heroClass: april.HERO_CLASS_ROGUE }
      ];
    },
    cards(state) {
      return state.cards;
    },
    selectedHero(state, getters) {
      return getters.heroes ? getters.heroes[state.selectedHeroIndex] : null;
    }
  },
  mutations: {
    updateState(state, data) {
      console.log("april updateState", data);
      // if (data.balance !== undefined) {
      //   state.balance = { ...state.balance, ...data.balance };
      // }
      if (data.dailyRewards !== undefined) {
        state.dailyRewards = data.dailyRewards;
        this.$app.$emit("april-show-daily-reward");
      }
    },
    setInitialState(state, data) {
      console.log("april setInitialState", data);
      state.loaded = true;
      // state.balance = data.user.balance;
      state.dailyRewards = data.user.dailyRewards;
    },
    updatePreGameBooster(state, type) {
      state.preGameBoosters[type] = state.preGameBoosters[type] === 1 ? 0 : 1;
    },
    setHeroIndex(state, value) {
      state.selectedHeroIndex = value;
    }
  },
  actions: {
    async load(store) {
      let result = await this.$app.$game._wrapOperation(Operations.AprilLoad);
      store.commit("setInitialState", result.response);
    },
    update(store, data) {
      store.commit("updateState", data);
    },
    subscribe(store) {
      this.$app.$game.onNetwork(Events.AprilUpdate, data => {
        store.dispatch("update", data);
      });
    },
    unsubscribe() {
      this.$app.$game.offNetwork(Events.AprilUpdate);
    },
    async claimRewards() {
      return (
        await this.$app.$game._wrapOperation(Operations.AprilClaimRewards)
      ).response;
    },
    increaseHeroIndex({ state, commit, getters }) {
      const newIndex = (state.selectedHeroIndex + 1) % getters.heroes.length;
      commit("setHeroIndex", newIndex);
    },
    decreaseHeroIndex({ state, commit, getters }) {
      const newIndex =
        (state.selectedHeroIndex - 1 < 0
          ? getters.heroes.length - 1
          : state.selectedHeroIndex - 1) % getters.heroes.length;
      commit("setHeroIndex", newIndex);
    },
    async rankings() {
      return (await this.$app.$game._wrapOperation(Operations.AprilRanking))
        .response;
    },
    async collectDailyReward() {
      await this.$app.$game._wrapOperation(Operations.AprilCollectDailyReward);
    }
  }
};

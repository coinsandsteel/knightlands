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
      gold: 0,
      points: 0
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
    sequence: [
      {
        // items on the board: hero, enemies
        items: [
          {
            id: "...",
            unitClass: "...",
            index: "...",
            hitZones: ["index1", "index2", "index3", "index4", "..."]
          }
        ],
        // cards in hand
        cards: [
          {
            id: "...",
            cardClass: "...",
            availableMoves: ["index1", "index2", "index3", "index4", "..."]
          }
        ],
        // number of cards in deck1
        deck1: 4,
        // number of cards in deck3
        deck3: 0,
        // cards move from deck 3 to deck 1
        cardsReset: false,
        // user's hp
        hp: 2,
        // number of turns left
        turns: 2,
        // win a round
        win: false
      }
    ]
  },
  getters: {
    heroes() {
      return [
        { id: 1, name: "Knight", heroClass: april.HERO_CLASS_KNIGHT },
        { id: 2, name: "Paladin", heroClass: april.HERO_CLASS_PALADIN },
        { id: 3, name: "Rogue", heroClass: april.HERO_CLASS_ROGUE }
      ];
    },
    selectedHero(state, getters) {
      return getters.heroes ? getters.heroes[state.selectedHeroIndex] : null;
    }
  },
  mutations: {
    updateState(state, data) {
      // if (data.balance !== undefined) {
      //   state.balance = { ...state.balance, ...data.balance };
      // }
    },
    setInitialState(state, data) {
      state.loaded = true;
      // state.balance = data.user.balance;
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
    }
  }
};

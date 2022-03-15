import * as april from "@/../../knightlands-shared/april";

import Events from "@/../../knightlands-shared/events";
import Operations from "@/../../knightlands-shared/operations";

export default {
  namespaced: true,
  state: {
    loaded: true,
    // ###### User ######
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
    hourRewardClaimed: null, // timestamp, sec
    // ###### Playground ######
    heroClass: april.HERO_CLASS_KNIGHT,
    level: 1,
    sessionResult: null, // "win", "loose"
    hp: 3,
    actionPoints: 2,
    cardsInQueue: 5,
    usedCards: 0,
    units: [
      { id: "wer2s929f", unitClass: april.UNIT_CLASS_HARLEQUIN, index: 6 },
      { id: "32vr45n7u6", unitClass: april.UNIT_CLASS_TEETH, index: 12 },
      { id: "89mnbv31x", unitClass: april.UNIT_CLASS_JACK, index: 13 },
      { id: "2n9v38534n", unitClass: april.UNIT_CLASS_HERO, index: 22 }
    ],
    damage: [
      1,
      1,
      1,
      0,
      0,
      1,
      1,
      2,
      2,
      0,
      1,
      2,
      2,
      1,
      1,
      0,
      1,
      1,
      2,
      0,
      0,
      0,
      0,
      0,
      0
    ],
    cards: [
      { id: "23c9834vn32", cardClass: april.CARD_CLASS_PAWN, nextCells: [17] },
      { id: "5gj56j6705k", cardClass: april.CARD_CLASS_ROOK, nextCells: [12] },
      { id: "2s23d99vvvg", cardClass: april.CARD_CLASS_PAWN, nextCells: [17] },
      { id: "mk0k0676k5n", cardClass: april.CARD_CLASS_PAWN, nextCells: [17] }
    ],
    selectedCardId: null,
    sessionRewardCardClass: april.CARD_CLASS_QUEEN,
    resurrectionCost: 0
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
    selectedCard(state, getters) {
      return getters.cards
        ? getters.cards.find(({ id }) => id === state.selectedCardId)
        : null;
    },
    moveZones(state, getters) {
      return getters.selectedCard ? getters.selectedCard.nextCells || [] : [];
    },
    damage(state) {
      return state.damage;
    },
    units(state) {
      return state.units;
    },
    selectedHero(state, getters) {
      return getters.heroes ? getters.heroes[state.selectedHeroIndex] : null;
    }
  },
  mutations: {
    updateState(state, data) {
      console.log("april updateState", data);

      if (data.sessionResult !== undefined) {
        state.sessionResult = data.sessionResult;
      }
      if (data.hp !== undefined) {
        state.hp = data.hp;
      }
      if (data.actionPoints !== undefined) {
        state.actionPoints = data.actionPoints;
      }
      if (data.cardsInQueue !== undefined) {
        state.cardsInQueue = data.cardsInQueue;
      }
      if (data.usedCards !== undefined) {
        state.usedCards = data.usedCards;
      }
      if (data.units !== undefined) {
        state.units = data.units;
      }
      if (data.damage !== undefined) {
        state.damage = data.damage;
      }
      if (data.cards !== undefined) {
        state.cards = data.cards;
      }
      if (data.selectedCardId !== undefined) {
        state.selectedCardId = data.selectedCardId;
      }
      if (data.balance !== undefined) {
        state.balance = { ...state.balance, ...data.balance };
      }
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

import * as april from "@/../../knightlands-shared/april";

import Events from "@/../../knightlands-shared/events";
import Operations from "@/../../knightlands-shared/operations";

export default {
  namespaced: true,
  state: {
    loaded: false,

    // ###### User ######
    balance: {
      sessionGold: 0,
      gold: 0
    },
    rewards: {
      dailyRewards: [],
      heroRewards: {
        [april.HERO_CLASS_KNIGHT]: { score: 0, claimed: false },
        [april.HERO_CLASS_PALADIN]: { score: 0, claimed: false },
        [april.HERO_CLASS_ROGUE]: { score: 0, claimed: false }
      },
      hourReward: {
        // First hour starts after daily reward was received
        // nextRewardAvailable resets after user claimed an hour reward
        nextRewardAvailable: 0, // timestamp, sec
        left: 0
      }
    },

    heroes: [],
    canPurchaseActionPoint: false,

    // Need to map after load() action
    // Because initially only heroClass will be provided by server.
    selectedHeroIndex: 0,

    // ###### Prices ######
    prices: {
      thirdAction: 0,
      resurrection: 0 // old: resurrectionCost
    },

    // ###### Map ######
    heroClass: april.HERO_CLASS_KNIGHT,
    level: 1,
    hp: 3,
    maxHp: 3,
    healing: 0,

    actionPoints: 2,
    sessionResult: null, // SESSION_RESULT_SUCCESS | SESSION_RESULT_FAIL
    selectedCardId: null,
    isDisabled: false, // disable interaction, wait for animation

    // ###### Croupier ######
    croupier: {
      cardsInQueue: 5,
      usedCards: [],
      cards: 0,
      newCard: null
    },

    // ###### Playground ######
    playground: {
      enemiesKilled: 0,
      units: [],
      damage: []
    }
  },
  getters: {
    sessionRewardCardClass(state) {
      return state.croupier.newCard;
    },
    heroes(state) {
      return april.HEROES.map(hero => {
        return {
          ...hero,
          unlocked:
            state.heroes.includes(hero.heroClass) ||
            hero.heroClass === april.HERO_CLASS_KNIGHT
        };
      });
    },
    cards(state) {
      return (state.croupier ? state.croupier.cards || [] : []).map(card => {
        return { ...card, hash: card.hash || card.id };
      });
    },
    selectedCard(state, getters) {
      return getters.cards.find(({ id }) => id === state.selectedCardId);
    },
    dailyRewards(state) {
      return state.rewards ? state.rewards.dailyRewards || [] : [];
    },
    heroRewards(state, getters) {
      if (!(state.rewards && state.rewards.heroRewards)) {
        null;
      }

      const keys = Object.keys(state.rewards.heroRewards);
      const heroRewards = {};
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const hero = getters.heroes.find(({ heroClass }) => heroClass === key);
        const reward = { ...state.rewards.heroRewards[key] };
        reward.goal = hero.rewardGoal;
        heroRewards[key] = reward;
      }
      return heroRewards;
    },
    hourReward(state) {
      if (!state.rewards) {
        return;
      }
      return state.rewards.hourReward;
    },
    moveZones(state, getters) {
      return getters.selectedCard ? getters.selectedCard.nextCells || [] : [];
    },
    damage(state) {
      return state.playground ? state.playground.damage : [];
    },
    units(state) {
      return state.playground ? state.playground.units : [];
    },
    selectedHero(state, getters) {
      return getters.heroes[state.selectedHeroIndex];
    },
    canPurchaseActionPoint(state) {
      return state.canPurchaseActionPoint && state.actionPoints <= 2;
    }
  },
  mutations: {
    updateState(state, data) {
      // User data
      if (data.balance !== undefined) {
        state.balance = { ...state.balance, ...data.balance };
      }
      if (data.dailyRewards !== undefined) {
        state.rewards.dailyRewards = data.dailyRewards;
        this.$app.$emit("april-show-daily-reward");
      }
      if (data.heroRewards !== undefined) {
        state.rewards.heroRewards = data.heroRewards;
      }
      if (data.hourReward !== undefined) {
        state.rewards.hourReward = data.hourReward;
      }
      if (data.heroes !== undefined) {
        state.heroes = data.heroes;
      }

      // Map data
      if (data.heroClass !== undefined) {
        state.heroClass = data.heroClass;
      }
      if (data.level !== undefined) {
        state.level = data.level;
      }
      if (data.sessionResult !== undefined) {
        state.sessionResult = data.sessionResult;
      }
      if (data.hp !== undefined) {
        state.hp = data.hp;
      }
      if (data.maxHp !== undefined) {
        state.maxHp = data.maxHp;
      }
      if (data.healing !== undefined) {
        state.healing = data.healing;
      }
      if (data.actionPoints !== undefined) {
        state.actionPoints = data.actionPoints;
      }

      // Prices
      if (data.prices !== undefined) {
        state.prices = { ...state.prices, ...data.prices };
      }

      // Playground
      if (data.enemiesKilled !== undefined) {
        state.playground.enemiesKilled = data.enemiesKilled;
      }
      if (data.units !== undefined) {
        state.playground.units = data.units;
      }
      if (data.damage !== undefined) {
        state.playground.damage = data.damage;
      }

      // Croupier
      if (data.newCard !== undefined) {
        state.croupier.newCard = data.newCard;
      }
      if (data.cardsInQueue !== undefined) {
        state.croupier.cardsInQueue = data.cardsInQueue;
      }
      if (data.cards !== undefined) {
        state.croupier.cards = data.cards;
      }
      if (data.usedCards !== undefined) {
        state.croupier.usedCards = data.usedCards;
      }

      // set selected hero index
      if (data.heroClass) {
        state.selectedHeroIndex = april.HEROES.findIndex(
          ({ heroClass }) => heroClass === data.heroClass
        );
      }
    },
    setInitialState(state, data) {
      state.loaded = true;

      // User data
      const userData = data.user;
      state.balance = userData.balance;
      state.hourRewardClaimed = userData.hourRewardClaimed;
      state.heroes = userData.heroes;
      state.rewards = userData.rewards;

      // Map data
      const mapData = data.map;
      state.heroClass = mapData.heroClass;
      state.level = mapData.level;
      state.sessionResult = mapData.sessionResult;
      state.hp = mapData.hp;
      state.maxHp = mapData.maxHp;
      state.healing = mapData.healing;
      state.actionPoints = mapData.actionPoints;

      // Playground
      const playgroundData = data.map.playground;
      state.playground.enemiesKilled = playgroundData.enemiesKilled;
      state.playground.units = playgroundData.units;
      state.playground.damage = playgroundData.damage;

      // Croupier
      const croupierData = data.map.croupier;
      state.croupier.newCard = croupierData.newCard;
      state.croupier.cardsInQueue = croupierData.cardsInQueue;
      state.croupier.cards = croupierData.cards;
      state.croupier.usedCards = croupierData.usedCards;

      // set selected hero index
      if (mapData.heroClass) {
        state.selectedHeroIndex = april.HEROES.findIndex(
          ({ heroClass }) => heroClass === mapData.heroClass
        );
      }
    },
    setHeroIndex(state, value) {
      state.selectedHeroIndex = value;
    },
    setSelectedCardId(state, value) {
      state.selectedCardId = value;
    },
    setIsDisabled(state, value) {
      state.isDisabled = value;
    }
  },
  actions: {
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

    // ###### OPERATIONS ######
    async testAction(store, action) {
      await this.$app.$game._wrapOperation(Operations.AprilTestAction, {
        action
      });
    },
    async load(store) {
      let result = await this.$app.$game._wrapOperation(Operations.AprilLoad);
      store.commit("setInitialState", result.response);
    },
    // type: REWARD_TYPE_HOUR | REWARD_TYPE_DAILY | REWARD_TYPE_RANKING | REWARD_TYPE_HERO
    // heroClass is need only if type == REWARD_TYPE_HERO
    async claimReward(store, { type, heroClass }) {
      return (
        await this.$app.$game._wrapOperation(Operations.AprilClaimReward, {
          type,
          heroClass
        })
      ).response;
    },
    async rankings() {
      return (await this.$app.$game._wrapOperation(Operations.AprilRankings))
        .response;
    },
    async heroStat() {
      return (await this.$app.$game._wrapOperation(Operations.AprilHeroStat))
        .response;
    },
    // heroClass: HERO_CLASS_KNIGHT | HERO_CLASS_PALADIN | HERO_CLASS_ROGUE
    async purchaseHero(store, { heroClass }) {
      await this.$app.$game._wrapOperation(
        Operations.AprilPurchaseHero,
        heroClass
      );
    },
    // Start from level #1
    // heroClass: HERO_CLASS_KNIGHT | HERO_CLASS_PALADIN | HERO_CLASS_ROGUE
    async restart(store, { heroClass }) {
      await this.$app.$game._wrapOperation(Operations.AprilRestart, heroClass);
      store.commit("setIsDisabled", false);
    },
    // Move hero
    // index: number;
    async move(store, { cardId, index }) {
      store.commit("setIsDisabled", true);
      await this.$app.$game._wrapOperation(Operations.AprilMove, {
        cardId,
        index
      });
      store.commit("setSelectedCardId", null);
      setTimeout(() => {
        store.commit("setIsDisabled", false);
      }, 1000);
    },
    // Skip a turn
    async skip(store) {
      await this.$app.$game._wrapOperation(Operations.AprilSkip);
      store.commit("setSelectedCardId", null);
      setTimeout(() => {
        store.commit("setIsDisabled", false);
      }, 1000);
    },
    // Purchase third action
    async purchaseAction({ commit }) {
      await this.$app.$game._wrapOperation(Operations.AprilPurchaseAction);
    },
    // Start from level > 1
    // booster: BOOSTER_CARD | BOOSTER_HP
    async enterLevel(store, { booster }) {
      await this.$app.$game._wrapOperation(Operations.AprilEnterLevel, booster);
      store.commit("setIsDisabled", false);
    },
    // Buy new life, rewind one step back
    async resurrect({ dispatch, commit }) {
      await this.$app.$game._wrapOperation(Operations.AprilResurrect);
      dispatch("load");
      commit("setIsDisabled", false);
    },
    // Exit playground
    async exit() {
      await this.$app.$game._wrapOperation(Operations.AprilExit);
    },
    // Purchase gold
    async purchaseGold(store, payload) {
      await this.$app.$game._wrapOperation(
        Operations.AprilPurchaseGold,
        payload
      );
    },
    // Purchase ticket
    async purchaseTicket() {
      await this.$app.$game._wrapOperation(Operations.AprilPurchaseTicket);
    },
    async testAction(store, action) {
      await this.$app.$game._wrapOperation(Operations.AprilTestAction, {
        action
      });
    }
  }
};

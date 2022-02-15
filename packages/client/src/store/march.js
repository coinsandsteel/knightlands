import * as march from "@/../../knightlands-shared/march";

import Events from "@/../../knightlands-shared/events";
import Operations from "@/../../knightlands-shared/operations";

export default {
  namespaced: true,
  state: {
    loaded: true,
    // User
    balance: {
      tickets: 15,
      gold: 300
    },
    boosters: {
      maxHealth: 0,
      extraLife: 0,
      key: 0
    },
    // Playground
    stat: {
      stepsToNextBoss: 10,
      bossesKilled: 0,
      penaltySteps: 0
    },
    pet: {
      petClass: 1,
      level: 1,
      armor: 0
    },
    cards: [],
    sequence: null
  },
  getters: {
    cards: state => {
      const items = [...state.cards];
      const result = items.map((card, index) => {
        const data = {
          index,
          isPet: card.unitClass === march.UNIT_CLASS_PET,
          canSwipe: card.unitClass === march.UNIT_CLASS_PET,
          isAdjacent: false,
          canClick: false
        };
        return {
          ...card,
          ...data
        };
      });

      const petCard = result.find(({ isPet }) => isPet);
      if (!petCard) {
        return result;
      }
      const petCardIndex = petCard.index;

      result.forEach((card, index) => {
        if (
          (petCardIndex % 3 === 0 &&
            (index === petCardIndex + 1 ||
              index === petCardIndex + 3 ||
              index === petCardIndex - 3)) ||
          (petCardIndex % 3 === 1 &&
            (index === petCardIndex + 1 ||
              index === petCardIndex - 1 ||
              index === petCardIndex + 3 ||
              index === petCardIndex - 3)) ||
          (petCardIndex % 3 === 2 &&
            (index === petCardIndex - 1 ||
              index === petCardIndex + 3 ||
              index === petCardIndex - 3))
        ) {
          card.isAdjacent = true;
          card.canClick = true;
        }
      });

      return result;
    }
  },
  mutations: {
    updateState(state, data) {
      if (data.balance !== undefined) {
        state.balance = data.balance;
      }
      if (data.boosters !== undefined) {
        state.boosters = data.boosters;
      }
      if (data.stat !== undefined) {
        state.stat = data.stat;
      }
      if (data.pet !== undefined) {
        state.pet = data.pet;
      }
      if (data.cards !== undefined) {
        state.cards = data.cards;
      }
      if (data.sequence !== undefined) {
        state.sequence = data.sequence;
      }
    },
    setInitialState(state, data) {
      state.loaded = true;
      state.balance = data.user.balance;
      state.boosters = data.user.boosters;
      state.stat = data.map.stat;
      state.pet = data.map.pet;
      state.cards = data.map.cards;
    }
  },
  actions: {
    async load(store) {
      let result = await this.$app.$game._wrapOperation(Operations.MarchLoad);
      store.commit("setInitialState", result.response);
    },
    update(store, data) {
      store.commit("updateState", data);
    },
    subscribe(store) {
      this.$app.$game.onNetwork(Events.MarchUpdate, data => {
        store.dispatch("update", data);
      });
    },
    unsubscribe() {
      this.$app.$game.offNetwork(Events.MarchUpdate);
    },
    async touchCard(index) {
      await this.$app.$game._wrapOperation(Operations.MarchTouch, index);
    }
  }
};

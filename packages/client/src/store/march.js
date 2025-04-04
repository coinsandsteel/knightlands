import * as march from "@/../../knightlands-shared/march";

import Events from "@/../../knightlands-shared/events";
import Operations from "@/../../knightlands-shared/operations";

function preprocessCards(cards, state) {
  for (let i = 0; i < cards.length; i++) {
    const card = cards[i];
    if (card && card.unitClass && card.hp) {
      if (card.unitClass === march.UNIT_CLASS_ENEMY) {
        card.unitIndex = (card.hp - 1) % 6;
      } else if (card.unitClass === march.UNIT_CLASS_ENEMY_BOSS) {
        card.unitIndex = state.bossIndex++ % 4;
      }
    }
  }
}

export default {
  namespaced: true,
  state: {
    loaded: false,
    // User
    balance: {
      sessionGold: 0,
      gold: 0
    },
    preGameBoosters: {
      [march.BOOSTER_HP]: 0,
      [march.BOOSTER_LIFE]: 0,
      [march.BOOSTER_KEY]: 0
    },
    pet: {
      petClass: 1,
      level: 1,
      armor: 0
    },
    pets: [],
    selectedPetIndex: 0,
    dailyRewards: [],
    // Playground
    stat: {
      stepsToNextBoss: 10,
      bossesKilled: 0,
      penaltySteps: 0
    },
    cards: [],
    sequence: null,
    miniGameReady: {
      isReady: false
    },
    miniGameResult: {
      isSuccess: false
    },
    bossIndex: 0
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
          canClick: false,
          opened: !!card.opened,
          unitIndex: card.unitIndex || 0,
          counter: card.counter || -1
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
    },
    petCard(state, getters) {
      return getters.cards.find(({ isPet }) => isPet);
    },
    pets(state) {
      const pets = [
        { petClass: 1, name: "Pet 1", level: 1, unlocked: false },
        { petClass: 2, name: "Pet 2", level: 1, unlocked: false },
        { petClass: 3, name: "Pet 3", level: 1, unlocked: false },
        { petClass: 4, name: "Pet 4", level: 1, unlocked: false },
        { petClass: 5, name: "Pet 5", level: 1, unlocked: false }
      ];

      pets.forEach(pet => {
        const petIndex = state.pets.findIndex(
          loadedPet => loadedPet.petClass === pet.petClass
        );
        if (petIndex !== -1) {
          pet.unlocked = true;
          pet.level = state.pets[petIndex].level;
        }
        return pet;
      });

      return pets;
    },
    allPets(state, getters) {
      const result = [];

      for (let i = 0; i < getters.pets.length; i++) {
        const currentPet = getters.pets[i];
        for (let j = 1; j <= 3; j++) {
          const pet = { ...currentPet };
          pet.key = `pet-${i + 1}-${j}`;
          pet.level = j;
          if (currentPet.unlocked) {
            pet.unlocked = pet.level <= currentPet.level;
          }

          result.push(pet);
        }
      }

      return result;
    },
    selectedPet(state, getters) {
      return getters.pets ? getters.pets[state.selectedPetIndex] : null;
    }
  },
  mutations: {
    updateState(state, data) {
      if (data.balance !== undefined) {
        state.balance = { ...state.balance, ...data.balance };
      }
      if (data.boosters !== undefined) {
        state.boosters = { ...state.boosters, ...data.boosters };
      }
      if (data.preGameBoosters !== undefined) {
        state.preGameBoosters = {
          ...state.preGameBoosters,
          ...data.preGameBoosters
        };
      }
      if (data.stat !== undefined) {
        state.stat = { ...state.stat, ...data.stat };
      }
      if (data.pet !== undefined) {
        state.pet = { ...state.pet, ...data.pet };
        if (data.pet.petClass !== undefined) {
          state.selectedPetIndex = data.pet.petClass - 1;
        }
      }
      if (data.pets !== undefined) {
        state.pets = data.pets;
      }
      if (data.cards !== undefined) {
        if (!(data.shouldIgnoreProcess === true)) {
          preprocessCards(data.cards, state);
        }
        state.cards = data.cards;
      }
      if (data.sequence !== undefined) {
        for (let i = 0; i < data.sequence.length; i++) {
          preprocessCards(data.sequence[i].cards, state, true);
        }
        state.sequence = data.sequence;
      }
      if (data.miniGameReady !== undefined) {
        state.miniGameReady = data.miniGameReady;
      }
      if (data.miniGameResult !== undefined) {
        state.miniGameResult = data.miniGameResult;
      }
      if (data.dailyRewards !== undefined) {
        state.dailyRewards = data.dailyRewards;
        this.$app.$emit("march-show-daily-reward");
      }
    },
    setInitialState(state, data) {
      state.loaded = true;
      state.balance = data.user.balance;
      state.boosters = data.user.boosters;
      state.pets = data.user.pets;
      state.preGameBoosters = data.user.preGameBoosters;
      state.stat = data.map.stat;
      state.pet = data.map.pet;
      preprocessCards(data.map.cards, state);
      state.cards = data.map.cards;
      state.dailyRewards = data.user.dailyRewards;

      if (data.map.pet) {
        state.selectedPetIndex = data.map.pet.petClass - 1;
      }
    },
    setPetIndex(state, value) {
      state.selectedPetIndex = value;
    },
    updatePreGameBooster(state, type) {
      state.preGameBoosters[type] = state.preGameBoosters[type] === 1 ? 0 : 1;
    },
    resetBossIndex(state) {
      state.bossIndex = 0;
    },
    clearCards(state) {
      state.cards = [];
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
    async touchCard(store, index) {
      await this.$app.$game._wrapOperation(Operations.MarchTouch, index);
    },
    async startNewGame(store, data) {
      await this.$app.$game._wrapOperation(Operations.MarchStartNewGame, data);
    },
    async exitGame() {
      await this.$app.$game._wrapOperation(Operations.MarchExitGame);
    },
    async testAction(store, action) {
      await this.$app.$game._wrapOperation(Operations.MarchTestAction, {
        action
      });
    },
    async collectDailyReward() {
      await this.$app.$game._wrapOperation(Operations.MarchCollectDailyReward);
    },
    async purchaseGold(store, payload) {
      await this.$app.$game._wrapOperation(
        Operations.MarchPurchaseGold,
        payload
      );
    },
    async openChest(store, keyNumber) {
      await this.$app.$game._wrapOperation(Operations.MarchOpenChest, {
        keyNumber
      });
    },
    async unlockPet(store, petClass) {
      await this.$app.$game._wrapOperation(Operations.MarchUnlockPet, {
        petClass
      });
    },
    async upgradePet(store, petClass) {
      return (
        await this.$app.$game._wrapOperation(Operations.MarchUpgradePet, {
          petClass
        })
      ).response;
    },
    async claimRewards() {
      return (
        await this.$app.$game._wrapOperation(Operations.MarchClaimRewards)
      ).response;
    },
    increasePetIndex({ state, commit, getters }) {
      const newIndex = (state.selectedPetIndex + 1) % getters.pets.length;
      commit("setPetIndex", newIndex);
    },
    decreasePetIndex({ state, commit, getters }) {
      const newIndex =
        (state.selectedPetIndex - 1 < 0
          ? getters.pets.length - 1
          : state.selectedPetIndex - 1) % getters.pets.length;
      commit("setPetIndex", newIndex);
    },
    async rankings() {
      return (await this.$app.$game._wrapOperation(Operations.MarchRanking))
        .response;
    }
  }
};

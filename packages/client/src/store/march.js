import _ from "lodash";
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
    cards: [
      {
        _id: "dc8c4aefc000",
        unitClass: march.UNIT_CLASS_PET,
        hp: 10
      },
      {
        _id: "dc8c4aefc001",
        unitClass: march.UNIT_CLASS_BOMB,
        hp: 5
      },
      {
        _id: "dc8c4aefc002",
        unitClass: march.UNIT_CLASS_CHEST,
        hp: 5
      },
      {
        _id: "dc8c4aefc003",
        unitClass: march.UNIT_CLASS_BARRELL,
        hp: 5
      },
      {
        _id: "dc8c4aefc004",
        unitClass: march.UNIT_CLASS_ENEMY,
        hp: 3
      },
      {
        _id: "dc8c4aefc005",
        unitClass: march.UNIT_CLASS_ENEMY_BOSS,
        hp: 8
      },
      {
        _id: "dc8c4aefc006",
        unitClass: march.UNIT_CLASS_TRAP,
        hp: 3,
        opened: true
      },
      {
        _id: "dc8c4aefc007",
        unitClass: march.UNIT_CLASS_HP,
        hp: 1
      },
      {
        _id: "dc8c4aefc008",
        unitClass: march.UNIT_CLASS_GOLD,
        hp: 4
      }
    ]
  },
  getters: {},
  mutations: {
    updateState(state, data) {},
    setInitialState(state, data) {
      state.loaded = true;
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
    }
  }
};

import Vue from "vue";
import Scenario from "./scenario";

export default {
  namespaced: true,
  state: {
    conditionPassed: false,
    step: 0,
    actionIndex: 0
  },
  mutations: {
    setConditionPassed(state, { passed }) {
      state.conditionPassed = passed;
    },
    setStep(state, { step }) {
      state.step = step;
      state.actionIndex = 0;
    },
    setActionIndex(state, { index }) {
      state.actionIndex = index;

      if (state.step >= Scenario.length) {
        state.actionIndex = 0;
        return;
      }

      const actions = Scenario[state.step].actions;
      if (actions.length <= state.actionIndex) {
        state.step++;
        state.actionIndex = 0;
      }
    }
  },
  actions: {
    async getRedirectUrl({ state }, { route }) {
      if (!state.conditionPassed || state.step >= Scenario.length) {
        return;
      }

      const actions = Scenario[state.step].actions;
      if (actions.length <= state.actionIndex) {
        return;
      }

      const actionData = actions[state.actionIndex];

      if (!actionData.lock) {
        return;
      }

      const lock = actionData.lock;
      if (lock.name) {
        if (route.name != lock.name) {
          return { name: lock.name, replace: true };
        }
      }

      if (lock.path) {
        if (route.fullPath != lock.path) {
          return { path: lock.path, replace: true };
        }
      }
    },
    checkConditions({ commit, state }, init) {
      let passed = true;

      if (state.step >= Scenario.length) {
        // commit("setStep", {
        //   step: Scenario.length - 1
        // });
        passed = false;
      }

      if (passed) {
        const actions = Scenario[state.step].actions;
        if (state.actionIndex >= actions.length) {
          commit("setStep", {
            step: state.step + 1
          });
        }

        if (init) {
          const actionData = actions[state.actionIndex];
          if (actionData.return !== undefined) {
            commit("setActionIndex", {
              index: actionData.return
            });
          }
        }

        if (state.step >= Scenario.length) {
          passed = false;
        } else {
          const cond = Scenario[state.step].cond;

          if (cond.level && cond.level > Vue.prototype.$game.character.level) {
            passed = false;
          }

          if (cond.item) {
            if (
              Vue.prototype.$game.inventory.getItemsCountByTemplate(
                cond.item
              ) == 0
            ) {
              passed = false;
            }
          }
        }
      }

      commit("setConditionPassed", {
        passed
      });
    }
  }
};

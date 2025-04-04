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
      state.conditionPassed = false;
    },
    setActionIndex(state, { index }) {
      state.actionIndex = index;
    }
  },
  actions: {
    async advanceAction({ dispatch, state }) {
      await dispatch("moveToAction", { index: state.actionIndex + 1 });
    },
    async moveToAction({ commit, state }, { index }) {
      commit("setActionIndex", { index: index });

      const actions = Scenario[state.step].actions;
      if (actions.length <= state.actionIndex) {
        await Vue.prototype.$game.completeTutorial(state.step);
        Vue.prototype.$app.logEvent("tutorial", { step: state.step });
        commit("setStep", { step: state.step + 1 });
      }
    },
    async skipCurrentStep({ commit, state }) {
      await Vue.prototype.$game.completeTutorial(state.step);

      commit("setStep", {
        step: state.step + 1
      });
    },
    async getRedirectUrl({ state, dispatch }, { route }) {
      if (!state.conditionPassed || state.step >= Scenario.length) {
        return;
      }

      const actions = Scenario[state.step].actions;
      if (actions.length <= state.actionIndex) {
        return;
      }

      const actionData = actions[state.actionIndex];

      if (!actionData.lock && !actionData.teleport) {
        return;
      }

      if (actionData.teleport) {
        await dispatch("skipCurrentStep");
        return { ...actionData.teleport, replace: true };
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
    async checkConditions(
      { commit, state, dispatch },
      { route, isInit, event }
    ) {
      let passed = true;

      while (state.step < Scenario.length) {
        if (Vue.prototype.$game.isTutorialFinished(state.step)) {
          state.step++;
        } else {
          break;
        }
      }

      if (state.step >= Scenario.length) {
        // commit("setStep", {
        //   step: Scenario.length - 1
        // });
        passed = false;
      }

      if (passed) {
        const actions = Scenario[state.step].actions;
        const actionData = actions[state.actionIndex];
        if (isInit && actionData.return !== undefined) {
          await dispatch("moveToAction", {
            index: actionData.return
          });
        }
      }

      if (state.conditionPassed) {
        return;
      }

      if (passed) {
        const actions = Scenario[state.step].actions;
        if (state.actionIndex >= actions.length) {
          await Vue.prototype.$game.completeTutorial(state.step);
          commit("setStep", {
            step: state.step + 1
          });
        }

        if (state.step >= Scenario.length) {
          passed = false;
        } else {
          const cond = Scenario[state.step].cond;
          if (cond.level && cond.level > Vue.prototype.$game.character.level) {
            passed = false;
          }

          if (cond.event && cond.event != event) {
            passed = false;
          }

          if (cond.items) {
            for (const item of cond.items) {
              if (
                Vue.prototype.$game.inventory.getItemsCountByTemplate(item) == 0
              ) {
                passed = false;
                break;
              }
            }
          }

          if (cond.path) {
            if (route.fullPath != cond.path) {
              passed = false;
            }
          }

          if (cond.name) {
            if (route.name != cond.name) {
              passed = false;
            }
          }

          if (cond.fullClass) {
            if (!Vue.prototype.$character.class) {
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

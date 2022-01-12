import Vue from "vue";

export default {
  namespaced: true,
  state: {
    step: 0,
    readyToCollect: false,
    timeLeft: 0
  },
  mutations: {
    setAll(state, { step, readyToCollect, timeLeft }) {
      state.readyToCollect = readyToCollect;
      state.step = step;
      state.timeLeft = timeLeft;
    }
  },
  actions: {
    async update(context) {
      const dailyLunarRewardStatus = await Vue.prototype.$game.fetchDailyLunarRewardStatus();
      context.commit("setAll", {
        step: dailyLunarRewardStatus.step,
        readyToCollect: dailyLunarRewardStatus.readyToCollect,
        timeLeft: dailyLunarRewardStatus.untilNext / 1000
      });
    }
  }
};

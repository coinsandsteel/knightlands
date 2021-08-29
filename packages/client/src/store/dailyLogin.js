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
      const dailyRewardStatus = await Vue.prototype.$game.fetchDailyRewardStatus();
      context.commit("setAll", {
        step: dailyRewardStatus.step,
        readyToCollect: dailyRewardStatus.readyToCollect,
        timeLeft: dailyRewardStatus.untilNext / 1000
      });
    }
  }
};

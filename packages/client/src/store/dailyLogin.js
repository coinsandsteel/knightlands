import Timer from "../timer";
import Vue from "vue";

export default {
  namespaced: true,
  state: {
    step: 0,
    readyToCollect: false,
    timer: new Timer(true)
  },
  mutations: {
    setAll(state, { step, readyToCollect, timeLeft }) {
      state.readyToCollect = readyToCollect;
      state.step = step;
      state.timer.timeLeft = timeLeft;
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

import Vue from "vue";

export default {
  namespaced: true,
  state: {
    status: null
  },
  mutations: {
    setPurchaseComplete(state) {
      state.status = null;
    },
    setStatus(state, status) {
      state.status = status;
    }
  },
  actions: {
    async refreshStatus(context) {
      const status = await Vue.prototype.$game.paymentStatus();
      context.commit("setStatus", status);
    }
  }
};

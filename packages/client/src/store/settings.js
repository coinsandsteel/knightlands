export default {
  namespaced: true,
  state: {
    music: true,
    sounds: true
  },
  mutations: {
    setMusic(state, onOrOff) {
      state.music = onOrOff;
    },
    setSounds(state, onOrOff) {
      state.sounds = onOrOff;
    }
  },
  actions: {
    async setMusicEnabled(context, enabled) {
      context.commit("setMusic", enabled);
    },
    async setSoundsEnabled(context, enabled) {
      context.commit("setSounds", enabled);
    }
  }
};

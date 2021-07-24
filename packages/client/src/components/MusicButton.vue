<template>
  <span
    class="icon-sounds huge pointer"
    :class="{ enabled: sounds }"
    @click="toggleSounds"
  ></span>
</template>

<script>
import { mapState } from "vuex";

export default {
  computed: {
    ...mapState({
      computedMusic: state => state.settings.music,
      computedSounds: state => state.settings.sounds
    }),
    sounds() {
      return this.computedMusic || this.computedSounds;
    }
  },
  methods: {
    toggleSounds() {
      let sounds = this.sounds;
      this.$game.$store.dispatch("settings/setMusicEnabled", !sounds);
      this.$game.$store.dispatch("settings/setSoundsEnabled", !sounds);
    }
  }
};
</script>

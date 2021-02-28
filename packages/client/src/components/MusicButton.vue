<template>
  <span
    class="icon-sounds huge"
    :class="{ enabled: sounds }"
    @click="sounds = !sounds"
  ></span>
</template>

<script>
import { mapState } from "vuex";

export default {
  data: () => ({
    sounds: true
  }),
  computed: {
    ...mapState({
      computedMusic: state => state.settings.music,
      computedSounds: state => state.settings.sounds
    })
  },
  mounted() {
    this.sounds = this.computedMusic || this.computedSounds;
  },
  watch: {
    sounds() {
      this.$game.$store.dispatch("settings/setMusicEnabled", this.sounds);
      this.$game.$store.dispatch("settings/setSoundsEnabled", this.sounds);
    }
  }
};
</script>

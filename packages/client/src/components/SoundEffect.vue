<template>
  <span v-if="false"></span>
</template>

<script>
import anime from "animejs/lib/anime.es.js";
import { mapState } from "vuex";

const MAX_VOLUME = 0.25;

export default {
  props: {
    files: Array,
    channel: {
      type: String,
      default: "fx"
    }
  },
  data: () => ({
    fileIndex: 0
  }),
  computed: {
    ...mapState({
      computedSound: state => state.settings.sounds
    }),
    source() {
      return `/sounds/${this.files[this.fileIndex]}.mp3`;
    },
    audio() {
      return this.$app.getSoundChannel(this.channel);
    }
  },
  methods: {
    async play() {
      anime.set(this.audio, {
        volume: MAX_VOLUME
      });

      if (!this.computedSound) {
        return;
      }

      this.fileIndex = Math.floor(Math.random() * this.files.length);

      this.$nextTick(() => {
        this.audio.src = this.source;
        this.audio.load();
        this.audio.play();
      });
    }
  }
};
</script>

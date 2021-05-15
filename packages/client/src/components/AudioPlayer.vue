<template>
  <audio :src="source" loop ref="audio" type="audio/mpeg" />
</template>

<script>
import anime from "animejs/lib/anime.es.js";
import { mapState } from "vuex";

export default {
  props: {
    volume: {
      type: Number,
      default: 0.4
    }
  },
  data: () => ({
    file: ""
  }),
  computed: {
    ...mapState({
      computedMusic: state => state.settings.music
    }),
    source() {
      return `/music/${this.file}.mp3`;
    }
  },
  watch: {
    async computedMusic() {
      let volume = 0;
      if (this.computedMusic) {
        this.$refs.audio.play();
        volume = this.volume;
      }

      await this.fade(volume);

      if (!this.computedMusic) {
        this.$refs.audio.pause();
      }
    }
  },
  methods: {
    async play(file) {
      if (this.file == file) {
        return;
      }

      if (this.file) {
        await this.fade(0);
      }

      anime.set(this.$refs.audio, {
        volume: 0
      });

      this.file = file;

      if (!this.computedMusic) {
        return;
      }

      let exit = false;
      while (!exit) {
        try {
          await this.$refs.audio.load();
          await this.$refs.audio.play();
          anime.set(this.$refs.audio, {
            volume: this.volume
          });
          // this.fade(this.volume);
          exit = true;
        } catch {
          await new Promise(resolve => {
            setTimeout(resolve, 1000);
          });
        }
      }
    },
    async fade(volume) {
      await anime({
        targets: this.$refs.audio,
        volume: volume,
        duration: 1000,
        easing: "linear"
      }).finished;
    }
  }
};
</script>

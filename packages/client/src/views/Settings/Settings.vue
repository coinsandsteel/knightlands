<template>
  <div class="screen-content flex-center">
    <div class="screen-background"></div>

    <span class="font-size-20 font-weight-900 margin-bottom-5">{{
      $t("online", { online })
    }}</span>

    <div
      class="flex flex-center flex-space-between flex-no-wrap font-size-22 width-50 center"
    >
      <p-check
        class="p-switch  margin-bottom-1 p-fill"
        color="success"
        v-model="music"
        >{{ "Music" }}</p-check
      >

      <p-check
        class="p-switch margin-bottom-1 p-fill"
        color="success"
        v-model="sounds"
        >{{ "Sound" }}</p-check
      >
    </div>
  </div>
</template>

<script>
import AppSection from "@/AppSection.vue";
import { mapState } from "vuex";

let switchInProgress = false;

export default {
  mixins: [AppSection],
  created() {
    this.title = "w-settings";
  },
  data: () => ({
    music: true,
    sounds: true,
    online: 0
  }),
  computed: {
    ...mapState({
      computedMusic: state => state.settings.music,
      computedSounds: state => state.settings.sounds
    })
  },
  async mounted() {
    this.music = this.computedMusic;
    this.sounds = this.computedSounds;

    const { online } = await this.$game.getOnline();
    this.online = online;

    this._updateOnlineCounter = this.updateOnlineCounter.bind(this);
    this._onlineChannel = this.$game.createChannel("online", false);
    this._onlineChannel.watch(this._updateOnlineCounter);
  },
  destroyed() {
    this._onlineChannel.destroy();
    this._onlineChannel = null;
  },
  watch: {
    "$store.state.settings": {
      handler() {
        switchInProgress = true;
        this.$nextTick(() => {
          this.music = this.computedMusic;
          this.sounds = this.computedSounds;
          this.$nextTick(() => {
            switchInProgress = false;
          });
        });
      },
      deep: true
    },
    music() {
      if (switchInProgress) {
        return;
      }
      this.$game.$store.dispatch("settings/setMusicEnabled", this.music);
    },
    sounds() {
      if (switchInProgress) {
        return;
      }
      this.$game.$store.dispatch("settings/setSoundsEnabled", this.sounds);
    }
  },
  methods: {
    updateOnlineCounter(data) {
      this.online = data.online;
    }
  }
};
</script>

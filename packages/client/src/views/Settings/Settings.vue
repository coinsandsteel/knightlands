<template>
  <div class="screen-content flex-center relative">
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

    <CustomButton
      type="grey"
      class="margin-top-5"
      @click="logout"
      minWidth="20rem"
      >{{ $t("logout") }}</CustomButton
    >

    <div class="font-size-20 font-weight-900 margin-top-5">
      {{ $t("acc", { m: $game.account }) }}
    </div>

    <div class="flex flex-center margin-top-5">
      <CopyButton
        :data="$game.id"
        caption="acc-id"
        minWidth="20rem"
      ></CopyButton>
    </div>

    <Locale />

    <a href="http://www.akashics.moe" class="akashi" target="_blank">{{
      $t("akashi")
    }}</a>
  </div>
</template>

<script>
import AppSection from "@/AppSection.vue";
import { mapState } from "vuex";
import CustomButton from "@/components/Button.vue";
import CopyButton from "@/components/CopyButton.vue";
import Locale from "@/components/Locale.vue";

let switchInProgress = false;

export default {
  mixins: [AppSection],
  components: { CustomButton, CopyButton, Locale },
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
    },
    getReferral() {
      return `${window.location.host}/#/login?referral=${this.$game.id}`;
    },
    logout() {
      this.$game.logout();
    }
  }
};
</script>

<style lang="less" scoped>
.akashi {
  position: absolute;
  bottom: 2rem;
  font-size: 2rem;
}
</style>

<template>
  <SpinePlayer
    class="width-100 height-100"
    ref="animation"
    :skeletonFile="skeletonFile"
    :skeletonName="skeletonName"
    :atlas="skeletonFile"
    :atlasImage="skeletonFile"
    :folder="`raids/${skeletonName}`"
    :binary="true"
    :translateY="2"
    @ready="playIdle"
  />
</template>

<script>
import SpinePlayer from "@/components/SpinePlayer.vue";
import RaidsMeta from "@/metadata/raids_meta";

export default {
  components: { SpinePlayer },
  props: ["raid"],
  computed: {
    skeletonName() {
      return RaidsMeta[this.raid].skeletonName;
    },
    skeletonFile() {
      return RaidsMeta[this.raid].skeletonDataName;
    }
  },
  methods: {
    playIdle() {
      let state = this.$refs.animation.getState();
      state.addAnimation(0, RaidsMeta[this.raid].idleAnimation, true, 0);
    },
    async playAttack() {
      let state = this.$refs.animation.getState();

      const animations = RaidsMeta[this.raid].attackAnimations;
      const index = Math.floor(Math.random() * animations.length);
      const attackAnimationName = animations[index];
      state.setAnimation(0, attackAnimationName, false);

      await new Promise(resolve => {
        state.addListener({
          complete: track => {
            if (track.animation.name !== attackAnimationName) {
              return;
            }

            state.clearListeners();
            resolve();
          }
        });
      });

      this.playIdle();
    },
    playDamageTaken() {
      let state = this.$refs.animation.getState();
      state.setAnimation(0, RaidsMeta[this.raid].damagedAnimation, false);
      this.playIdle();
    }
  }
};
</script>

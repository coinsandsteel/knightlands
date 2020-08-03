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
    @ready="handleAnimationReady"
  />
</template>

<script>
import SpinePlayer from "@/components/SpinePlayer.vue";
import RaidsMeta from "@/raids_meta";

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
    handleAnimationReady() {
      let state = this.$refs.animation.getState();
      state.setAnimation(0, RaidsMeta[this.raid].idleAnimation, true);
    },
    playAttack() {
      let state = this.$refs.animation.getState();

      const animations = RaidsMeta[this.raid].attackAnimations;
      const index = Math.floor(Math.random() * animations.length);
      state.setAnimation(0, animations[index], false);
      state.addAnimation(0, RaidsMeta[this.raid].idleAnimation, true);
    },
    playDamageTaken() {
      let state = this.$refs.animation.getState();
      state.setAnimation(0, RaidsMeta[this.raid].damagedAnimation, false);
      state.addAnimation(0, RaidsMeta[this.raid].idleAnimation, true);
    }
  }
};
</script>

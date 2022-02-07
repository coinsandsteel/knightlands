<template>
  <img class="heroImage pointer" :class="{ mini }" :src="activeAvatar" />
</template>

<script>
import AvatarsMeta from "@/avatars";

export default {
  props: ["preview", "avatar", "mini"],
  computed: {
    activeAvatar() {
      const id = this.avatar || this.$game.character.avatar;
      if (!id || id < 1) {
        return "";
      }

      return `/images/avatars/${AvatarsMeta.avatars[id].icon}.jpg`;
    }
  }
};
</script>

<style lang="less" scoped>
.heroImage {
  max-width: 10rem;

  &.mini {
    max-width: 4rem;
  }
}
</style>

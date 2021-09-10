<template>
  <img
    class="heroImage pointer"
    :class="{ mini }"
    @click="changeAvatar"
    :src="activeAvatar"
  />
</template>

<script>
import AvatarsMeta from "@/avatars";

import { create } from "vue-modal-dialogs";
import ChangeAvatar from "./ChangeAvatar.vue";

const ShowChangeAvatar = create(ChangeAvatar);

export default {
  props: ["preview", "avatar", "mini"],
  computed: {
    activeAvatar() {
      const id = this.avatar || this.$game.character.avatar;
      if (!id) {
        return "";
      }
      return `/images/avatars/${AvatarsMeta.avatars[id].icon}.jpg`;
    }
  },
  methods: {
    changeAvatar() {
      if (!this.avatar) {
        ShowChangeAvatar();
      }
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

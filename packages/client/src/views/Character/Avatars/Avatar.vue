<template>
  <img class="heroImage" @click="changeAvatar" :src="activeAvatar" />
</template>

<script>
import AvatarsMeta from "@/avatars";

import { create } from "vue-modal-dialogs";
import ChangeAvatar from "./ChangeAvatar.vue";

const ShowChangeAvatar = create(ChangeAvatar);

export default {
  computed: {
    activeAvatar() {
      const id = this.$game.character.avatar;
      if (!id) {
        return "";
      }
      return `/images/avatars/${AvatarsMeta.avatars[id].icon}.jpg`;
    }
  },
  methods: {
    changeAvatar() {
      ShowChangeAvatar();
    }
  }
};
</script>

<style lang="less" scoped>
.heroImage {
  max-width: 10rem;
}
</style>

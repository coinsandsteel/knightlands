<template>
  <div class="avatar-entry relative" @click="handleClick">
    <img v-lazy="icon" />

    <div
      class="selector-border panel-selected"
      :class="{ show: selected }"
    ></div>
  </div>
</template>

<script>
import AvatarsMeta from "@/avatars";

export default {
  props: ["id"],
  computed: {
    icon() {
      return `/images/avatars/${AvatarsMeta.avatars[this.id].icon}.jpg`;
    },
    selected() {
      return this.id == this.$game.character.avatar;
    }
  },
  methods: {
    handleClick() {
      this.$emit("click", this.id);
    }
  }
};
</script>

<style lang="less" scoped>
.avatar-entry {
  width: 10rem;

  img {
    max-width: 10rem;
  }
}

.selector-border {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  transition: all 0.2s ease;
  opacity: 0;

  &.show {
    opacity: 1;
  }
}
</style>

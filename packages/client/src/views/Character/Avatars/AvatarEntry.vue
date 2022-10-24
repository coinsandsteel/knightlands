<template>
  <div
    class="avatar-entry relative pointer"
    :class="{ disabled: disabled }"
    @click="handleClick"
  >
    <img v-lazy="icon" />

    <div
      class="selector-border panel-selected"
      :class="{ show: selected }"
    ></div>
  </div>
</template>

<script>
import AvatarsMeta from "@/metadata/avatars";

export default {
  props: ["id", "disabled", "selected"],
  computed: {
    icon() {
      return `/images/avatars/${AvatarsMeta.avatars[this.id].icon}.jpg`;
    }
  },
  methods: {
    handleClick() {
      if (!this.disabled) {
        this.$emit("click", this.id);
      }
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

.disabled {
  opacity: 0.5;
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

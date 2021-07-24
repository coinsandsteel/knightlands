<template>
  <div @click.self="handleClick" class="relative">
    <div
      class="flex flex-center width-100 height-100 relative"
      :class="{ 'pointer-events-none': isLocked }"
    >
      <div class="absolute-stretch locked-o flex flex-center" v-if="isLocked">
        <div></div>
      </div>
      <slot></slot>
    </div>
  </div>
</template>

<script>
import SectionsProgress from "@/sections_progress";

export default {
  props: ["section"],
  computed: {
    levelRequired() {
      return SectionsProgress[this.section];
    },
    isLocked() {
      return this.levelRequired > this.$character.level;
    }
  },
  methods: {
    handleClick(e) {
      if (this.isLocked) {
        // this.$notify({
        //   group: "levelLock",
        //   max: 2,
        //   type: "error",
        //   text: this.$t("s-locked", { lvl: this.levelRequired }),
        //   data: {
        //     level: this.levelRequired
        //   },
        //   duration: 500
        // });
      } else {
        this.$slots["default"][0].elm.click();
      }
    }
  }
};
</script>

<style lang="less" scoped>
@import (reference) "../style/ui.less";

.locked-o {
  z-index: 2;
  background-color: #0f03036e;

  div {
    .icon_lock_big;
    height: 5rem !important;
    width: 4rem;
  }
}
</style>

<template>
  <div
    class="flex mask-hidden flex-center width-100 height-100"
    @click.self="handleClose"
    v-on="$listeners"
    :class="{ mask: !hideMask }"
  >
    <div
      class="width-100"
      v-bar="{
        scrollThrottle: 30
      }"
    >
      <div>
        <div
          class="content flex-no-wrap flex-column flex center"
          :class="[type, contentClass]"
        >
          <Title class="margin-top-3" v-if="title">{{ $t(title) }}</Title>

          <div
            v-if="!hideCloseBtn"
            class="close-btn"
            @click="handleClose"
          ></div>

          <div class="margin-top-2 margin-bottom-2">
            <slot name="content"></slot>
          </div>

          <div v-show="hasFooterSlot" class="flex flex-center footer">
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Title from "@/components/Title.vue";

export default {
  props: {
    title: String,
    compact: Boolean,
    titleClass: String,
    hideCloseBtn: Boolean,
    type: {
      type: String,
      default: "panel-popup"
    },
    contentClass: String,
    hideMask: Boolean,
    disableScroll: Boolean
  },
  components: { Title },
  methods: {
    handleClose() {
      if (this.$close) {
        this.$close();
      } else if (this.$parent.$close) {
        this.$parent.$close();
      } else {
        this.$emit("close");
      }
    }
  },
  computed: {
    hasFooterSlot() {
      return !!this.$slots["footer"];
    }
  }
};
</script>

<style lang="less" scoped>
@import (reference) "./../style/common.less";

.mask {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.555);
  z-index: 900;
  overflow: hidden auto;
}

.content {
  position: relative;
  padding: 2rem 1.1rem 1rem 1.1rem;
}

.footer {
  margin-top: 2rem;
  margin-bottom: 1rem;
}

.scrollable-content {
  // max-height: 90%;
}
</style>

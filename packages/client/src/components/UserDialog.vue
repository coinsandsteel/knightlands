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

          <CloseButton v-if="!hideCloseBtn" @click="handleClose"></CloseButton>

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
import CloseButton from "@/components/CloseButton.vue";

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
    disableScroll: Boolean,
    emitClose: Boolean
  },
  components: { Title, CloseButton },
  methods: {
    handleClose() {
      if (this.emitClose) {
        this.$emit("close");
        return;
      }

      if (this.$parent.$close) {
        this.$parent.$close();
      } else if (this.$close) {
        this.$close();
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
  z-index: 101;
  overflow: hidden auto;
}

.content {
  position: relative;
  padding: 2rem 0.9rem 1rem 0.9rem;
}

.footer {
  margin-top: 2rem;
  margin-bottom: 1rem;
}
</style>

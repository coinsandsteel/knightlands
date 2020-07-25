<template>
  <div
    class="flex mask-hidden flex-center width-100 height-100"
    @click.self="handleClose"
    :class="{'mask': !hideMask}"
  >
    <div class="width-95" v-bar="{
          scrollThrottle: 30
      }">
      <div>
        <div class="content flex-no-wrap flex-column flex center" :class="[type, contentClass]">
          <div
            class="margin-top-3 flex flex-center font-size-25 font-weight-700 margin-bottom-2 font-outline"
            :class="[titleClass, {compact:compact, 'title':compact}]"
            v-if="title"
          >
            <span>{{$t(title)}}</span>
          </div>

          <div v-if="!hideCloseBtn" class="close-btn" @click="handleClose"></div>

          <div>
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
  methods: {
    handleClose() {
      if (this.$close) {
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


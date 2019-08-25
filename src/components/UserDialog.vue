<template>
  <div class="mask flex flex-center" @click.self="handleClose">
    <div class="content flex-no-wrap flex flex-column flex center panel-light">
      <div
        class="dialog-title flex flex-center font-size-30 font-weight-700 margin-bottom-3 font-outline"
        :class="[titleClass, {compact:compact, 'title':compact}]"
        v-if="title"
      >
        <span>{{title}}</span>
      </div>
      <div class="close-btn" @click="handleClose"></div>
      <div v-bar="{
          preventParentScroll: true,
          scrollThrottle: 30,
      }">
        <div class="scrollable-content">
          <slot name="content"></slot>
        </div>
      </div>
      <div class="flex flex-center footer">
        <slot name="footer"></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["title", "compact", "titleClass"],
  methods: {
    handleClose() {
      if (this.$close) {
        this.$close();
      } else {
        this.$emit("close");
      }
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
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 900;
}

.content {
  position: relative;
  padding: 1rem;
  width: 90%;

  @media only screen and (max-width: 480px) and (min-width: 321px) {
    width: 35rem;
  }
}

.footer {
  margin-top: 3rem;
}

.dialog-title {
  margin-top: 3rem;
  padding: 0.5rem 0.65rem 0.5rem 0.65rem;
}

.scrollable-content {
  max-height: 80vh;
}
</style>


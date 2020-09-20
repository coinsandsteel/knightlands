<template>
  <div
    class="width-100 flex flex-center relative flex-self-start"
    :class="{ stackTop: stackTop, stackBottom: stackBottom }"
  >
    <div class="flex-full title-side"></div>
    <span
      class="font-size-22 capitalize title flex flex-center"
      :class="titleClass"
    >
      <span>{{ title }}</span>
      <slot></slot>
    </span>
    <div class="flex-full title-side"></div>
  </div>
</template>

<script>
export default {
  props: ["title", "stackTop", "stackBottom", "titleClass"]
};
</script>

<style lang="less" scoped>
@import (reference) "../style/common.less";

.title {
  border-image-source: url("../assets/ui/title.png");
  border-image-slice: 38 30 38 30 fill;
  border-image-width: 38px 30px 38px 30px;
  border-image-outset: 0px 0px 0px 0px;
  border-image-repeat: round round;
  border-style: none;
  padding: 0rem 2rem;
  align-self: center;
  height: @TitleHeight;
  min-width: 10rem;
}

.title-side {
  background-image: url("../assets/ui/title1.png");
  height: @TitleSideHeight;
  background-size: 100% 100%;
}

.stackTop {
  margin-top: -(@TitleHeight - @TitleSideHeight)/2;
  z-index: 4;
}

.stackBottom {
  margin-bottom: -(@TitleHeight - @TitleSideHeight)/2;
  z-index: 4;
}
</style>

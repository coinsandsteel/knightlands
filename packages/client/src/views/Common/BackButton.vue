<template>
  <span class="back-button" @click="$emit('click')"></span>
</template>
<script></script>
<style scoped lang="less">
@import (reference) "../../style/common.less";
@import (reference) "../../style/ui.less";
@backButtonWidth: 6rem;
@backButtonHeight: 6rem;
@footerBottomPadding: 0.5rem;
.back-button {
  display: block;
  cursor: pointer;
  width: @backButtonWidth !important;
  height: @backButtonHeight !important;
  // .mobile({width: @backButtonWidth/2; height: @backButtonHeight / 2});
  margin-left: 1.2rem;
  .button_back;

  &:active {
    .button_back_active;
  }
}
</style>

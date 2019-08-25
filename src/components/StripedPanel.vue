<template>
  <div class="flex flex-column flex-item-center panel-content" :class="type">
    <slot name="header">
      <span v-if="title" class="flex flex-center font-size-25 margin-bottom-5 title">{{$t("title")}}</span>
    </slot>
    <div :class="contentClasses" class="flex flex-column relative width-100">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: String,
    contentClasses: [Array, String],
    type: {
      type: String,
      default: "panel"
    }
  }
};
</script>

<style lang="less">
@headlineColor: #2e2135;
@contentPadding: 3rem;
@panelBorderWidth: 0.2rem;

.headline {
  background-color: @headlineColor;
  padding: 3rem 0 3rem 0;
}

@pickerBgHeight: 160%;
.stripe {
  position: absolute;
  background-color: #303048;
  width: calc(100% + @contentPadding * 2 - @panelBorderWidth*2);
  height: @pickerBgHeight;
  left: 0;
  top: 50%;
  transform: translateX(-@contentPadding + @panelBorderWidth) translateY(-50%);
}

.panel-content {
  padding: 1rem @contentPadding 1rem @contentPadding;
  margin: 2rem 3rem 0rem 3rem;
}

.panel-content {
  & > .title {
    padding: 0.5rem 2rem 0.5rem 2rem;
  }
}
</style>
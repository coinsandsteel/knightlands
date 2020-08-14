<template>
  <div class="flex flex-column flex-center">
    <div class="refill-icon relative">
      <div :class="[`icon-refill-${refill.type}`, {opaque: collected}]" class="width-100 height-100"></div>
      <div class="absolute-stretch" :class="{collected: collected}"></div>
      <span class="font-size-22 font-weight-700 font-outline quantity">{{refill.quantity}}</span>
    </div>
    <span class="font-size-18">{{$t(refill.type)}}</span>
  </div>
</template>

<script>
export default {
  props: ["refill", "collected"]
};
</script>

<style lang="less" scoped>
@import (reference) "../../style/common.less";

.refill-icon {
  width: @lootCellSize;
  height: @lootCellSize;
}

.collected {
  background-image: url("../../assets/ui/checkbox_tick.png");
  background-size: 50%;
  background-position: center;
  background-repeat: no-repeat;
  position: absolute;
  width: @lootCellSize;
  height: @lootCellSize;
}

.opaque {
  opacity: 0.3;
}

.quantity {
  z-index: 1;
  top: 0.4rem;
  right: 0.2rem;
  position: absolute;
}
</style>
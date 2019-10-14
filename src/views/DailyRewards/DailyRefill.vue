<template>
  <div class="flex flex-column flex-center">
    <div class="refill-icon relative">
      <div :class="[`icon-${refill.type}`, {opaque: collected}]" class="width-100 height-100"></div>
      <div class="absolute-stretch" :class="{collected: collected}"></div>
    </div>
    <span class="font-size-18">{{$t("refill-quantity", {count: refill.quantity})}}</span>
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
</style>
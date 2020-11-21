<template>
  <div class="item-badge-grid">
    <div class="element-flag" :class="element"></div>
    <span :class="`weapon-badge ${weaponType}`" class="flag-badge"></span>
  </div>
</template>

<script>
export default {
  props: ["weaponType", "element"]
};
</script>

<style lang="less" scoped>
@import (reference) url("../../style/ui.less");

.item-badge-grid {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: repeat(2, 50%);

  & .element-flag {
    grid-column: 1;
    grid-row: ~"1 / 3";
  }

  & .flag-badge {
    grid-column: 1;
    grid-row: 2;
    align-self: baseline;
    justify-self: center;
  }
}

.element-flag {
  margin: auto;
  width: 80% !important;
  height: 100% !important;

  &.darkness {
    .troops_mini_ribbon_darkness;
  }

  &.light {
    .troops_mini_ribbon_light;
  }

  &.earth {
    .troops_mini_ribbon_earth;
  }

  &.water {
    .troops_mini_ribbon_water;
  }

  &.physical {
    .troops_mini_ribbon_physical;
  }
}
</style>

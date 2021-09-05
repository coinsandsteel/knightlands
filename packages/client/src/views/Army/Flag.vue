<template>
  <div class="item-badge-grid">
    <div class="element-flag" :class="element"></div>
    <span
      :class="`weapon-badge ${weaponType}`"
      class="flag-badge grid-center-self"
    ></span>
  </div>
</template>

<script>
export default {
  props: ["weaponType", "element"]
};
</script>

<style lang="less" scoped>
.item-badge-grid {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: repeat(2, 50%);
  justify-items: stretch;

  & .element-flag {
    grid-column: 1;
    grid-row: ~"1 / 3";
  }
  & .flag-badge {
    grid-column: 1;
    grid-row: 2;
  }
}
.element-flag {
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
  &.darkness {
    background-image: url("/images/ui/troops_mini_ribbon_darkness.png");
  }
  &.light {
    background-image: url("/images/ui/troops_mini_ribbon_light.png");
  }
  &.earth {
    background-image: url("/images/ui/troops_mini_ribbon_earth.png");
  }
  &.water {
    background-image: url("/images/ui/troops_mini_ribbon_water.png");
  }
  &.physical {
    background-image: url("/images/ui/troops_mini_ribbon_physical.png");
  }
}
</style>

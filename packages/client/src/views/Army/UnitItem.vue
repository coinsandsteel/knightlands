<template>
  <div class="outer unit-item relative pointer" @click="$emit('click', unit)">
    <div class="inner relative">
      <template v-if="unit">
        <div class="bg absolute-stretch" :style="unitIcon"></div>
        <div class="selected" v-show="selected"></div>
        <div
          class="flex flex-column height-100 relative flex-no-wrap flex-items-start unit-item-content"
        >
          <!-- <div class="unit-item-shadow"></div> -->
          <UnitStars
            class="stars width-100 relative"
            :stars="stars"
            size="small"
          />
          <Flag
            class="flag"
            :weaponType="weaponType"
            :element="element"
            :type="unitType"
          />
          <span
            class="width-100 font-size-22 font-weight-900 unit-item-lvl font-outline center-transform"
            >{{ $t("unit-lvl", { lvl: level }) }}</span
          >
        </div>
      </template>
      <div class="absolute-stretch remove-u" v-else-if="!empty"></div>
    </div>
  </div>
</template>

<script>
import UnitGetter from "./UnitGetterMixin.vue";
import UnitStars from "./UnitStars.vue";
import Flag from "./Flag.vue";

export default {
  props: ["unit", "selected", "empty"],
  mixins: [UnitGetter],
  components: { UnitStars, Flag }
};
</script>

<style lang="less" scoped>
@import (reference) "../../style/common.less";

.selected {
  .troops_mini_bg_selected;
  .icon-stretched;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}

.unit-item-content {
  display: grid;
  grid-template-columns: 30% 60% 10%;
  grid-template-rows: 10% 1fr 30%;
  align-items: stretch;

  & .item-badge-grid {
    grid-column: 1;
    grid-row: 2;
  }

  & .stars {
    grid-column: ~"2/3";
    grid-row: 1;
  }

  & .flag {
    grid-column: 1;
    grid-row: ~"1/4";
  }
}

.outer {
  position: relative;

  &:before {
    display: block;
    content: "";
    width: 100%;
    padding-top: 100%;
  }

  & > .inner {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }
}

.unit-item-lvl {
  position: absolute;
  bottom: 10%;
}

.unit-item {
  & .bg {
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center;
    width: 100%;
    height: 100%;
  }

  // & ::before {
  //   padding-top: 100%;
  // }
}

.remove-u {
  .troops_mini_bg_remove;
  .icon-stretched;
}
</style>

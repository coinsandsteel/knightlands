<template>
  <div class="outer unit-item relative pointer" @click="$emit('click', unit)">
    <div class="inner relative">
      <template v-if="unit">
        <div class="bg absolute-stretch" :style="unitIcon"></div>
        <div class="selected" v-show="selected"></div>
        <div
          class="flex flex-column height-100 relative flex-no-wrap flex-items-start unit-item-content"
        >
          <div class="unit-item-shadow"></div>
          <UnitStars
            class="stars width-100 relative"
            :stars="stars"
            size="small"
          />
          <Flag :weaponType="weaponType" :element="element" />
          <span
            class="width-100 font-size-18 font-weight-900 unit-item-lvl center-transform"
            >{{ $t("unit-lvl", { lvl: level }) }}</span
          >
        </div>
      </template>
      <div class="flex flex-center width-100 height-100" v-else-if="!empty">
        <span class="font-size-22">{{ $t("unit-remove") }}</span>
      </div>
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
.selected {
  background-image: url("../../assets/ui/troops_mini_bg_selected.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}

.unit-item-content {
  display: grid;
  grid-template-columns: 30% 1fr;
  grid-template-rows: 20% 1fr 20%;
  align-items: stretch;

  & .item-badge-grid {
    grid-column: 1;
    grid-row: 2;
  }

  & .stars {
    grid-column: ~"1/3";
    grid-row: 1;
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

.unit-item-shadow {
  background-image: url("../../assets/ui/troops_mini_shadow.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  position: absolute;
  left: 1%;
  right: 1%;
  top: 1%;
  bottom: 1%;
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
</style>

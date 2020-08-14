<template>
  <div class="outer" @click="$emit('click')">
    <div class="inner root font-size-18 relative">
      <div class="bg width-100 height-100" :style="unitImage"></div>
      <div class="absolute-stretch flex flex-center" v-if="!unit">
        <div class="empty"></div>
      </div>
      <UnitStars class="stars" :stars="stars" size="small" />
      <Flag class="item-badge-grid" :weaponType="weaponType" :element="element" />
      <span class="unit-type font-size-20">{{$t(unitType)}}</span>
      <span class="unit-level font-size-20">{{$t("unit-lvl", {lvl: level})}}</span>
    </div>
  </div>
</template>

<script>
import UnitStars from "./UnitStars.vue";
import UnitGetter from "./UnitGetterMixin.vue";
import Flag from "./Flag.vue";

export default {
  props: ["unit"],
  mixins: [UnitGetter],
  components: { UnitStars, Flag }
};
</script>

<style lang="less" scoped>
.outer {
  position: relative;
  // padding-top: 75%;

  // &:after {
  //   display: block;
  //   content: "";
  //   // width: 100%;
  //   // padding-top: (4 / 3) * 100%;
  //   height: 15rem;
  // }

  &:before {
    content: "";
    width: 100%;
    display: inline-block;
    padding-bottom: calc(100% / (16 / 9));
  }

  & > .inner {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
}

.root {
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-position: center;
  background-image: url("../../assets/ui/troops_bg.png");

  display: grid;
  grid-template-columns: 20% 1fr;
  grid-template-rows: 30% 30% 1fr 1fr 1fr;
  align-items: stretch;

  & .item-badge-grid {
    grid-column: 1;
    grid-row: 1;
  }

  & .stars {
    grid-column: ~"1/3";
    grid-row: 3;
  }

  & .unit-type {
    grid-column: ~"1/3";
    grid-row: 4;

    background-color: rgba(0, 0, 0, 0.3);
    width: 100%;
    padding: 0 0.5rem 0 0.5rem;
  }

  & .unit-level {
    grid-column: ~"1/3";
    grid-row: 5;
  }

  & .bg {
    grid-column: ~"1/3";
    grid-row: ~"1/3";

    background-repeat: no-repeat;
    background-size: contain;
    background-position: center;
  }

  & .empty {
    background-image: url("../../assets/ui/button_plus_training_camp.png");
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center;

    width: 6rem;
    height: 6rem;
  }
}
</style>

<template>
  <div class="outer pointer" @click="$emit('click')">
    <div class="inner root font-size-18 relative padding-half">
      <div class="bg width-100 height-100" :style="unitImage"></div>
      <div class="absolute-stretch flex flex-center" v-if="!unit && !preview">
        <div class="empty"></div>
      </div>
      <template v-if="unit">
        <UnitStars class="stars flex-center" :stars="stars" />
        <Flag
          class="item-badge-grid"
          :weaponType="weaponType"
          :element="element"
          :type="unitType"
        />
        <div class="name flex flex-center">
          <span
            class="capitalize white-space-no-wrap font-size-30 font-weight-900 font-outline"
            >{{ $t(name) }}</span
          >
        </div>
        <div class="unit-level flex flex-center">
          <span class="font-size-30 font-weight-900 font-outline">{{
            $t("unit-lvl", { lvl: level })
          }}</span>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import UnitStars from "./UnitStars.vue";
import UnitGetter from "./UnitGetterMixin.vue";
import Flag from "./Flag.vue";

export default {
  props: ["unit", "preview"],
  mixins: [UnitGetter],
  components: { UnitStars, Flag }
};
</script>

<style lang="less" scoped>
.outer {
  position: relative;

  &:before {
    content: "";
    width: 100%;
    display: inline-block;
    padding-bottom: calc(100% / (9 / 16));
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
  grid-template-columns: 30% 1fr;
  grid-template-rows: 30% 30% 1fr 28px 1fr;
  align-items: stretch;

  & .name {
    grid-column: ~"1/3";
    grid-row: 3;
  }

  & .item-badge-grid {
    grid-column: 1;
    grid-row: ~"1/3";
  }

  & .stars {
    grid-column: ~"1/3";
    grid-row: 4;
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

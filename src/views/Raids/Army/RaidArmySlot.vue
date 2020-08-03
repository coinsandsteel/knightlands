<template>
  <div class="unit-item relative" @click="$emit('click', unit)">
    <template v-if="unit">
      <div class="bg absolute-stretch" :style="unitImage"></div>
      <div class="selected" v-show="selected"></div>
      <div
        class="flex flex-column height-100 relative flex-no-wrap flex-items-start unit-item-content"
      >
        <div class="unit-item-shadow absolute-stretch"></div>
        <UnitStars class="stars width-100 relative" :stars="stars" size="small" />
        <Flag :weaponType="weaponType" :element="element" />
        <span
          class="width-100 font-size-18 font-weight-900 unit-item-lvl center-transform"
        >{{$t("unit-lvl", {lvl: level})}}</span>
      </div>
    </template>
  </div>
</template>

<script>
import UnitGetter from "../../Army/UnitGetterMixin.vue";
import UnitStars from "../../Army/UnitStars.vue";
import Flag from "../../Army/Flag.vue";

export default {
  props: ["unit", "selected", "empty"],
  mixins: [UnitGetter],
  components: { UnitStars, Flag }
};
</script>

<style lang="less" scoped>
.selected {
  background-image: url("../../../assets/ui/slot_selected.png");
  background-repeat: no-repeat;
  background-size: contain;
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

.unit-item-lvl {
  position: absolute;
  bottom: 0;
}

.unit-item-shadow {
  background-image: url("../../../assets/ui/troops_mini_shadow.png");
  background-repeat: no-repeat;
  background-size: cover;
}

.unit-item {
  background-image: url("../../../assets/ui/troops_mini_bg.png");
  background-repeat: no-repeat;
  background-size: cover;

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

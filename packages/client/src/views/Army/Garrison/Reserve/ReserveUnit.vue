<template>
  <div class="outer unit-item relative" @click="$emit('click', unit)">
    <div class="inner relative">
      <template v-if="unit">
        <div class="bg absolute-stretch" :style="unitIcon"></div>
        <div class="selected" v-show="selected"></div>
        <div
          class="flex flex-column height-100 relative flex-no-wrap flex-items-start unit-item-content"
        >
          <UnitStars
            class="stars width-90 relative"
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
            class="width-100 font-size-22 font-weight-900 font-outline unit-item-lvl center-transform"
            >x{{ unit.count }}</span
          >
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import UnitGetter from "../../UnitGetterMixin.vue";
import UnitStars from "../../UnitStars.vue";
import Flag from "../../Flag.vue";

export default {
  props: ["unit", "selected"],
  mixins: [UnitGetter],
  components: { UnitStars, Flag }
};
</script>

<style lang="less" scoped>
.selected {
  background-image: url("../../../../assets/ui/troops_mini_bg_selected.png");
  background-repeat: no-repeat;
  background-size: cover;
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
  background-image: url("../../../../assets/ui/troops_mini_bg.png");
  background-repeat: no-repeat;
  background-size: cover;

  & .bg {
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center;
    width: 100%;
    height: 100%;
  }
}
</style>

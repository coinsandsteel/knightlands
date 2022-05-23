<template>
  <div
    class="battle-unit"
    :class="unit ? 'battle-unit' + '--' + unit.unitClass : 'battle-unit--empty'"
    @click="clickHandler"
  >
    <div class="battle-unit-wrapper relative">
      <div class="absolute-stretch"></div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    unit: Object,
    isSelected: Boolean
  },
  data() {
    return {
      // isSelected1: false
    };
  },
  methods: {
    clickHandler() {
      // this.isSelected1 = !this.isSelected1;
      this.$emit("click", this.unit);
    }
  }
};
</script>
<style scoped lang="less">
.battle-unit-wrapper {
  background: url("/images/battle/units/unit.png") center/100% no-repeat;
  padding-bottom: 100%;
}
.battle-unit--empty .battle-unit-wrapper {
  background-image: url("/images/battle/units/unit-empty.png");
}
.battle-unit--melee .battle-unit-wrapper {
  background-image: url("/images/battle/units/unit-melee.png");
}
.battle-unit--range .battle-unit-wrapper {
  background-image: url("/images/battle/units/unit-range.png");
}
.battle-unit--mage .battle-unit-wrapper {
  background-image: url("/images/battle/units/unit-mage.png");
}
.battle-unit--tank .battle-unit-wrapper {
  background-image: url("/images/battle/units/unit-tank.png");
}
.battle-unit--support .battle-unit-wrapper {
  background-image: url("/images/battle/units/unit-support.png");
}
// .battle-unit--selected .battle-unit-wrapper {
//   background-image: url("/images/battle/unit_bg_selected.png");
// }
</style>

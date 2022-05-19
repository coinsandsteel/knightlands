<template>
  <div class="battle-unit" @click="clickHandler">
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
  background: url("/images/battle/unit_bg.png") center/100% no-repeat;
  padding-bottom: 100%;
}
.battle-unit--selected .battle-unit-wrapper {
  background-image: url("/images/battle/unit_bg_selected.png");
}
</style>

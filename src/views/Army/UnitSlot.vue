<template>
  <div
    class="root panel-dark flex flex-column flex-no-wrap font-size-18 flex-center"
    @click="$emit('click')"
  >
    <div class="bg width-100 height-100" :class="{'empty': !unit}" :style="unitImage"></div>
    <UnitStars :stars="stars" size="small" />
    <span>{{$t(unitType)}}</span>
    <div class="flex flex-items-center flex-no-wrap" v-if="unit">
      <span class="icon-water"></span>
      <span class="icon-earth"></span>
      <span>{{$t("unit-lvl", {lvl: level})}}</span>
    </div>
  </div>
</template>

<script>
import UnitStars from "./UnitStars.vue";
import UnitGetter from "./UnitGetterMixin.vue";

export default {
  props: ["unit"],
  mixins: [UnitGetter],
  components: { UnitStars }
};
</script>

<style lang="less" scoped>
.bg {
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;

  &.empty {
    background-image: url("../../assets/ui/button_plus_status_bar.png");
  }
}

.root {
//   width: 30%;
//   height: 15rem;
}
</style>

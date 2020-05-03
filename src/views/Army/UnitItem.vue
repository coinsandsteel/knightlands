<template>
  <div class="panel-input unit-item relative" @click="$emit('click', unit)">
    <template v-if="unit">
      <div class="bg absolute-stretch" :style="unitImage"></div>
      <div class="flex flex-column flex-space-between height-100 relative flex-no-wrap">
        <UnitStars :stars="stars" size="small" />
        <div class="flex flex-column flex-self-start">
          <span :class="`icon-unit-${element} medium`"></span>
          <span :class="`icon-${weaponType} medium`"></span>
        </div>
        <span class="font-size-18">{{$t("unit-lvl", {lvl: level})}}</span>
      </div>
    </template>
    <div class="flex flex-center width-100 height-100" v-else>
      <span class="font-size-22">{{$t("unit-remove")}}</span>
    </div>
  </div>
</template>

<script>
import UnitGetter from "./UnitGetterMixin.vue";
import UnitStars from "./UnitStars.vue";

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
  width: 100%;
  height: 100%;
}
</style>

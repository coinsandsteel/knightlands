<template>
  <div class="width-100 relative flex" v-if="unit">
    <div class="bg" :class="element"></div>
    
    <!-- Title -->
    <UnitTitle class="width-100 unit-title" :unit="unit" />

    <div class="flex flex-column flex-full">
        <span>Damage: 99999</span>
    </div>

    <div class="unit-image width-60" :style="unitImage"></div>
  </div>
</template>

<script>
import Ui from "@/ui_constants";
import UnitTitle from "./UnitTitle.vue";
import UnitGetter from "./UnitGetterMixin.vue";

export default {
  props: ["unit"],
  mixins: [UnitGetter],
  components: { UnitTitle }
};
</script>

<style lang="less" scoped>
.bg {
  background-image: url("../../assets/backgrounds/1674_1057934862.png");
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  image-rendering: pixelated;
  position: absolute !important;
  top: -4rem !important;
  left: 0 !important;
  right: 0 !important;
  bottom: 0rem !important;
  z-index: -1;
}

.unit-image {
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
  height: 24rem;
}

.unit-title {
    position: absolute;
    top: 0;
}
</style>


<template>
  <div class="width-100 relative flex unit-view-container">
    <template v-if="unit">
      <div class="bg" :class="element"></div>

      <!-- Title -->
      <UnitTitle class="width-100 unit-title" :unit="unit" />

      <!-- Unit -->
      <div class="flex flex-column flex-full flex-space-between padding-top-5 font-size-18">
        <div class="flex flex-center flex-column">
          <div class="padding-half panel-input unit-view-param center">
            <UnitStars :stars="stars" size="big" />
          </div>
          <div class="margin-top-1 padding-half panel-input flex flex-center unit-view-param">
            <span class="font-size-18 margin-right-1">Damage:</span>
            <span class="font-size-22 font-weight-900">99999</span>
          </div>
        </div>

        <div class="flex flex-column">
          <SkewedButton type="green" class="margin-bottom-half">Equipment</SkewedButton>
          <SkewedButton type="purple" class="margin-bottom-half">Abilities</SkewedButton>
        </div>
      </div>

      <div class="width-60 flex flex-items-end flex-center padding-bottom-1">
        <img class="unit-image" :src="$game.armyDB.getIcon(unit)" />
      </div>
    </template>
    <div v-else>
        EMPTY
    </div>
  </div>
</template>

<script>
import Ui from "@/ui_constants";
import UnitTitle from "./UnitTitle.vue";
import UnitGetter from "./UnitGetterMixin.vue";
import UnitStars from "./UnitStars.vue";
import SkewedButton from "@/components/SkewedButton.vue";

export default {
  props: ["unit"],
  mixins: [UnitGetter],
  components: { UnitTitle, UnitStars, SkewedButton }
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

.unit-view-container {
  height: 30rem;
}

.unit-view-param {
  width: 18rem;
}

.unit-image {
  background-position: 50% 90%;
  background-repeat: no-repeat;
  background-size: contain;
  height: auto;
  width: auto;
  max-width: 100%;
  max-height: 100%;
}

.unit-title {
  position: absolute;
  top: 0;
}
</style>


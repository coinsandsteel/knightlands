<template>
  <div>
    <div class="flex width-100 pixelated">
      <div class="title-tip margin-left-2" :class="element"></div>
      <div class="title-body flex-full flex" :class="element">
        <span class="title-icon" :class="`icon-unit-${element}`"></span>
        <span class="title-icon" :class="`icon-unit-${weaponType}`"></span>
        <div class="title-text-container flex flex-center font-size-22 font-outline font-weight-900">
            <span class="title-level margin-right-1">{{$t("unit-lvl", { lvl: level })}}</span>
            <span>{{$t(name)}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import UnitGetter from "./UnitGetterMixin.vue";

export default {
  props: ["unit"],
  mixins: [UnitGetter]
};
</script>

<style lang="less" scoped>
.title-tip {
  background-size: 100% 100%;
  background-repeat: no-repeat;
  width: 2rem;
  height: 5rem;

  &.light {
      background-image: url("../../assets/ui/ribbon_tip_light.png");
  }

  &.darkness {
      background-image: url("../../assets/ui/ribbon_tip_darkness.png");
  }

  &.earth {
      background-image: url("../../assets/ui/ribbon_tip_earth.png");
  }

  &.water {
      background-image: url("../../assets/ui/ribbon_tip_water.png");
  }
}

.title-body {
  background-size: 100% 100%;
  background-repeat: repeat;

  &.light {
      background-image: url("../../assets/ui/ribbon_body_light.png");
  }

  &.darkness {
      background-image: url("../../assets/ui/ribbon_body_darkness.png");
  }

  &.earth {
      background-image: url("../../assets/ui/ribbon_body_earth.png");
  }

  &.water {
      background-image: url("../../assets/ui/ribbon_body_water.png");
  }
}

.title-icon {
  height: 3.5rem;
  width: 3.5rem;
}

.title-level {
    color: #ffe401;
}

.title-text-container {
    position: relative;
    top: -0.7rem;
}
</style>

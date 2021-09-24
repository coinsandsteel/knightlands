<template>
  <div>
    <div class="flex width-100">
      <div
        class="title-tip margin-left-2"
        :class="[element, { general: isGeneral }]"
      ></div>
      <div
        class="title-body flex-full flex flex-items-center"
        :class="[element, { general: isGeneral }]"
      >
        <span
          class="title-icon"
          :class="`icon-unit-${element}`"
          v-if="element"
        ></span>
        <span
          class="title-icon"
          :class="`icon-unit-${weaponType}`"
          v-if="weaponType"
        ></span>
        <span class="title-icon" :class="`unit_type_${unitType}`"></span>
        <div
          class="title-text-container flex flex-center font-size-25 font-outline font-weight-900"
        >
          <span v-if="showLevel" class="title-level margin-right-1">{{
            $t("unit-lvl", { lvl: level })
          }}</span>
          <span class="capitalize">{{ $t(name) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import UnitGetter from "./UnitGetterMixin.vue";

export default {
  props: {
    unit: Object,
    showLevel: {
      type: Boolean,
      default: true
    }
  },
  mixins: [UnitGetter]
};
</script>

<style lang="less" scoped>
@import (reference) url("../../style/ui.less");

.title-tip {
  width: 3rem !important;
  height: 5rem !important;

  &.light {
    .unit_light;
  }

  &.darkness {
    .unit_dark;
  }

  &.earth {
    .unit_earth;
  }

  &.water {
    .unit_water;
  }

  &.physical {
    .unit_physical;
  }

  &.general {
    .unit_general;
  }
}

.title-body {
  background-size: 100% 100%;
  background-repeat: repeat;

  &.light {
    background-image: url("../../assets/ui/unit_light1.png");
  }

  &.darkness {
    background-image: url("../../assets/ui/unit_dark1.png");
  }

  &.earth {
    background-image: url("../../assets/ui/unit_earth1.png");
  }

  &.water {
    background-image: url("../../assets/ui/unit_water1.png");
  }

  &.physical {
    background-image: url("../../assets/ui/unit_physical1.png");
  }

  &.general {
    background-image: url("../../assets/ui/unit_general1.png");
  }
}

.title-icon {
  height: 5rem !important;
  width: 5rem !important;
}

.title-level {
  color: #ffe401;
}

.title-text-container {
  position: relative;
  top: -0.7rem;
}
</style>

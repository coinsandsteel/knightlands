<template>
  <div
    class="width-100 relative flex flex-end unit-view-container flex-no-wrap"
  >
    <template v-if="unit">
      <div class="bg" :class="[element, { general: !unit.troop }]"></div>

      <!-- Title -->
      <UnitTitle
        class="width-100 unit-title"
        :unit="unit"
        :showLevel="!garrison"
      />

      <!-- Unit -->
      <div
        class="flex flex-column flex-full flex-center padding-top-5 font-size-18"
        v-if="!showAbilities && !garrison"
      >
        <div class="flex flex-center flex-column padding-left-3">
          <div class="padding-half panel-input unit-view-param center">
            <UnitStars
              :stars="stars"
              size="small"
              class="u-stars flex-center"
            />
          </div>
          <div
            class="margin-top-1 margin-bottom-1 padding-half panel-input flex flex-center unit-view-param font-size-22"
          >
            <IconWithValue iconClass="icon-damage" valueClass="font-size-22">{{
              estimatedDamage()
            }}</IconWithValue>
          </div>

          <div class="flex">
            <CustomButton
              type="green"
              id="unit-equip"
              class="margin-bottom-half"
              @click="goToEquipment"
              v-if="showEquipment"
            >
              <span class="icon-custom-unit huge"></span>
            </CustomButton>
            <CustomButton
              type="grey"
              class="margin-bottom-half"
              @click="showAbilities = true"
            >
              <span class="icon-pass-unit huge"></span>
            </CustomButton>
            <!-- <CustomButton
              type="yellow"
              class="margin-bottom-half"
              @click="$emit('select', unit)"
              v-if="showSelect"
            >
              <span class="icon-mark"></span>
            </CustomButton> -->
          </div>
        </div>
      </div>

      <div
        class="overlay-color flex flex-column absolute-stretch flex-space-evenly font-size-20"
        v-else-if="unit && showAbilities"
        @click="showAbilities = false"
      >
        <div
          class="flex flex-items-center whitespace-prewrap padding-left-4 padding-right-4"
          v-for="(ability, idx) in abilities"
          :key="idx"
          v-html="getAbilityDesc(ability)"
        ></div>
      </div>

      <div
        class="width-60 flex flex-items-end flex-center padding-top-3 height-100 unit-view relative"
        v-touch:swipe="swipeHandler"
      >
        <span
          class="nav-arrow left"
          v-if="showNavigation"
          @click="emitPrevious"
        ></span>
        <img class="unit-image" :src="$game.armyDB.getImage(unit)" />
        <span class="nav-arrow" v-if="showNavigation" @click="emitNext"></span>
      </div>
    </template>
    <div v-else>
      <div class="bg" :class="element"></div>
    </div>
  </div>
</template>

<script>
import UnitTitle from "./UnitTitle.vue";
import UnitGetter from "./UnitGetterMixin.vue";
import UnitStars from "./UnitStars.vue";
import CustomButton from "@/components/Button.vue";
import IconWithValue from "@/components/IconWithValue.vue";

export default {
  props: {
    unit: Object,
    units: Array,
    showEquipment: {
      type: Boolean,
      default: true
    },
    showSelect: Boolean,
    garrison: Boolean,
    showNavigation: Boolean
  },
  mixins: [UnitGetter],
  components: { UnitTitle, UnitStars, CustomButton, IconWithValue },
  data: () => ({
    showAbilities: false
  }),
  methods: {
    goToEquipment() {
      this.$router.push({
        name: "unit-equip",
        params: { unitId: this.unit.id, units: this.units }
      });
    },
    emitNext() {
      this.$emit("next");
    },
    emitPrevious() {
      this.$emit("prev");
    },
    swipeHandler(direction) {
      if (direction == "left") {
        this.emitNext();
      } else if (direction == "right") {
        this.emitPrevious();
      }
    }
  }
};
</script>

<style lang="less" scoped>
.unit-view {
  & .nav-arrow {
    position: absolute;
    right: 0;
    top: 50%;
  }

  & .nav-arrow.left {
    position: absolute;
    left: 0;
  }
}

.bg {
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  z-index: -1;
  position: absolute !important;
  top: -4rem !important;
  left: 0 !important;
  right: 0 !important;
  bottom: 0rem !important;

  &.water {
    background-image: url("../../assets/backgrounds/elem_water.png");
  }

  &.earth {
    background-image: url("../../assets/backgrounds/elem_earth.png");
  }

  &.darkness {
    background-image: url("../../assets/backgrounds/elem_dark.png");
  }

  &.light {
    background-image: url("../../assets/backgrounds/elem_light.png");
  }

  &.physical {
    background-image: url("../../assets/backgrounds/elem_phys.png");
  }

  &.general {
    background-image: url("../../assets/backgrounds/general.png");
  }
}

.overlay-color {
  z-index: 1;
}

.unit-view-container {
  height: 25vh;
}

.unit-view-param {
  min-width: 14rem;
}

.unit-image {
  max-width: 100%;
  max-height: 100%;
}

.unit-title {
  position: absolute;
  top: 0;
}

.u-stars {
  height: 3rem;
}
</style>

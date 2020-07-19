<template>
  <div class="width-100 relative flex flex-end unit-view-container flex-no-wrap">
    <template v-if="unit">
      <div class="bg" :class="element"></div>

      <!-- Title -->
      <UnitTitle class="width-100 unit-title" :unit="unit" />

      <!-- Unit -->
      <div
        class="flex flex-column flex-full flex-space-between padding-top-5 font-size-18"
        v-if="!showAbilities"
      >
        <div class="flex flex-center flex-column padding-left-3">
          <div class="padding-half panel-input unit-view-param center">
            <UnitStars :stars="stars" size="small" />
          </div>
          <div class="margin-top-1 padding-half panel-input flex flex-center unit-view-param font-size-22">
            <IconWithValue iconClass="icon-damage">{{estimatedDamage}}</IconWithValue>
          </div>
        </div>

        <div class="flex flex-column padding-left-3">
          <CustomButton
            type="green"
            class="margin-bottom-half"
            @click="goToEquipment"
            v-if="showEquipment"
          >{{$t("unit-equipment")}}</CustomButton>
          <CustomButton
            type="red"
            class="margin-bottom-half"
            @click="showAbilities = true"
          >{{$t("unit-abilities")}}</CustomButton>
          <CustomButton
            type="yellow"
            class="margin-bottom-half"
            @click="$emit('select', unit)"
            v-if="showSelect"
          >{{$t("unit-select")}}</CustomButton>
        </div>
      </div>

      <div
        class="overlay-color flex flex-column absolute-stretch flex-space-evenly font-size-20"
        v-else-if="unit && showAbilities"
        @click="showAbilities = false"
      >
        <div
          class="flex flex-center"
          v-for="(ability, idx) in abilities"
          :key="idx"
          v-html="getAbilityDesc(ability)"
        ></div>
      </div>

      <div class="width-60 flex flex-items-end flex-center padding-top-3 height-100">
        <img class="unit-image" :src="$game.armyDB.getIcon(unit)" />
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
  props: ["unit", "showEquipment", "showSelect"],
  mixins: [UnitGetter],
  components: { UnitTitle, UnitStars, CustomButton, IconWithValue },
  data: () => ({
    showAbilities: false
  }),
  methods: {
    goToEquipment() {
      this.$router.push({
        name: "unit-equip",
        params: { unitId: this.unit.id }
      });
    }
  }
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
</style>


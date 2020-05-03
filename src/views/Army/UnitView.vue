<template>
  <div class="width-100 relative flex flex-end unit-view-container">
    <template v-if="unit">
      <div class="bg" :class="element"></div>

      <!-- Title -->
      <UnitTitle class="width-100 unit-title" :unit="unit" />

      <!-- Unit -->
      <div
        class="flex flex-column flex-full flex-space-between padding-top-5 font-size-18"
        v-if="!showAbilities"
      >
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
          <SkewedButton
            type="green"
            class="margin-bottom-half"
            @click="goToEquipment"
            v-if="showEquipment"
          >{{$t("unit-equipment")}}</SkewedButton>
          <SkewedButton
            type="purple"
            class="margin-bottom-half"
            @click="showAbilities = true"
          >{{$t("unit-abilities")}}</SkewedButton>
        </div>
      </div>

      <div
        class="panel-input flex flex-column absolute-stretch flex-space-evenly padding-top-5 font-size-20"
        v-else-if="unit && showAbilities"
      >
        <span class="close-btn" @click="showAbilities = false"></span>
        <div
          class="flex flex-center"
          v-for="ability in abilities"
          :key="ability.id"
          v-html="getAbilityDesc(ability)"
        ></div>
      </div>

      <div class="width-60 flex flex-items-end flex-center padding-bottom-1">
        <img class="unit-image" :src="$game.armyDB.getIcon(unit)" />
      </div>
    </template>
    <div v-else>EMPTY</div>
  </div>
</template>

<script>
import UnitTitle from "./UnitTitle.vue";
import UnitGetter from "./UnitGetterMixin.vue";
import UnitStars from "./UnitStars.vue";
import SkewedButton from "@/components/SkewedButton.vue";

import ArmyUnitTypes from "@/army_unit_types";

export default {
  props: ["unit", "showEquipment"],
  mixins: [UnitGetter],
  components: { UnitTitle, UnitStars, SkewedButton },
  data: () => ({
    showAbilities: false
  }),
  methods: {
    getAbilityDesc(ability) {
      const levelValue = this.$game.armyDB.getAbilityLevelValue(
        this.unit,
        ability.id
      );

      const localisationParams = { ...levelValue, ...ability };
      if (ability.unitType) {
        localisationParams.unitType = this.$t(ArmyUnitTypes[ability.unitType]);
      }

      return this.$t(ability.type, localisationParams);
    },
    goToEquipment() {
      this.$router.push({
        name: "unit-equipment",
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


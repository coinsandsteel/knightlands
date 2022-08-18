<template>
  <div
    class="battle-unit-list-item flex flex-item-center pointer font-size-22"
    @click="clickHandler"
  >
    <BattleUnit :unit="unit" />
    <template v-if="unit">
      <div class="flex flex-item-center">
        <div class="text-align-left">
          <div class="padding-left-2">{{ title }}</div>
          <div class="padding-left-2">tier {{ tier }}, pwr: {{ power }}</div>
        </div>
        <div class="padding-left-2">
          <BattleUnitAbility
            v-for="(ability, index) in abilities"
            :key="ability.abilityType + ability.abilityClass"
            :ability="ability"
            :value="ability.value"
            :isSmallValue="true"
            :class="{
              'margin-left-1': index > 0,
              'opacity-50': !ability.enabled
            }"
          />
        </div>
      </div>
      <slot />
    </template>
  </div>
</template>
<script>
import BattleUnit from "@/views/Battle/BattleUnit.vue";
import BattleUnitAbility from "@/views/Battle/BattleUnitAbility.vue";
export default {
  components: {
    BattleUnit,
    BattleUnitAbility
  },
  props: {
    unit: Object
  },
  data() {
    return {};
  },
  computed: {
    tier() {
      return this.unit ? this.unit.tier || 0 : 0;
    },
    level() {
      return this.unit ? this.unit.level || 0 : 0;
    },
    power() {
      return this.unit ? this.unit.power || 0 : 0;
    },
    title() {
      return this.unit
        ? `${this.$t("battle-unit-tribe-" + this.unit.unitTribe)} ${this.$t(
            "battle-unit-class-" + this.unit.unitClass
          )}`
        : "";
    },
    experience() {
      return this.unit && this.unit.expirience
        ? this.unit.expirience.value || 0
        : 0;
    },
    abilities() {
      return this.unit && this.unit.abilities ? this.unit.abilities : [];
    }
  },
  methods: {
    clickHandler() {
      this.$emit("click", this.unit);
    }
  }
};
</script>
<style scoped lang="less">
.battle-unit-list-item {
  padding: 1rem;
}
.battle-unit {
  width: 7rem;
}
</style>

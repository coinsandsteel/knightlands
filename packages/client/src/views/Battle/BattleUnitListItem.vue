<template>
  <div
    class="battle-unit-list-item flex flex-item-center pointer font-size-22"
    @click="clickHandler"
  >
    <BattleUnit :unit="unit" />
    <template v-if="unit">
      <div class="padding-left-2">Tier: {{ tier }}</div>
      <div class="padding-left-2">Level: {{ level }}</div>
      <div class="padding-left-2">Exp: {{ experience }}</div>
      <div class="padding-left-2">
        <BattleUnitAbility
          v-for="(ability, index) in abilities"
          :key="ability.abilityGroup + ability.abilityClass"
          :ability="ability"
          :class="{
            'margin-left-1': index > 0,
            'opacity-50': !(ability.level && ability.level.current)
          }"
        />
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
      return this.unit && this.unit.level ? this.unit.level.current || 0 : 0;
    },
    experience() {
      return this.unit && this.unit.experience
        ? this.unit.experience.current || 0
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

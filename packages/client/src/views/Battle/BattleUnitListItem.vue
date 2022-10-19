<template>
  <div
    class="battle-unit-list-item flex flex-no-wrap flex-item-center pointer font-size-22"
    @click="clickHandler"
  >
    <BattleUnit
      :unit="unit"
      :isQuantityVisible="isQuantityVisible"
      class="flex-shrink-0"
    />
    <template v-if="unit">
      <div class="flex flex-wrap flex-item-center">
        <div class="text-align-left margin-bottom-half">
          <div class="padding-left-2">{{ title }}</div>
          <div class="padding-left-2">tier: {{ tier }}, power: {{ power }}</div>
        </div>
        <div class="padding-left-2">
          <BattleUnitAbility
            v-for="(ability, index) in abilities"
            :key="ability.abilityType + ability.abilityClass"
            :ability="ability"
            :value="ability.combatValue | rounded2Decimal"
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
import { mapState } from "vuex";
import BattleUnit from "@/views/Battle/BattleUnit.vue";
import BattleUnitAbility from "@/views/Battle/BattleUnitAbility.vue";
export default {
  components: {
    BattleUnit,
    BattleUnitAbility
  },
  props: {
    unit: Object,
    isQuantityVisible: Boolean
  },
  data() {
    return {};
  },
  computed: {
    ...mapState("battle", ["inventory"]),
    unitRecord() {
      if (!this.unit) {
        return null;
      }

      return (
        this.inventory.find(({ unitId }) => unitId === this.unit.unitId) ||
        this.unit
      );
    },
    tier() {
      return this.unitRecord
        ? this.unitRecord.tier || 0
        : this.unit
        ? this.unit.tier || 0
        : 0;
    },
    level() {
      return this.unitRecord ? this.unitRecord.level || 0 : 0;
    },
    power() {
      return this.unitRecord
        ? this.unitRecord.power || 0
        : this.unit
        ? this.unit.power || 0
        : 0;
    },
    title() {
      let title = "";
      if (this.unitRecord) {
        if (this.unitRecord.name) {
          title += this.unitRecord.name + " - ";
        }
        title += `${this.$t(
          "battle-unit-tribe-" + this.unitRecord.tribe
        )} ${this.$t("battle-unit-class-" + this.unitRecord.class)}`;
      }
      return title;
    },
    experience() {
      return this.unitRecord && this.unitRecord.expirience
        ? this.unitRecord.expirience.value || 0
        : 0;
    },
    abilities() {
      return this.unitRecord && this.unitRecord.abilities
        ? this.unitRecord.abilities
        : [];
    }
  },
  filters: {
    rounded2Decimal(value) {
      return Math.round(value * 100) / 100;
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
  padding: 1.5rem 1rem;
}
.battle-unit {
  width: 7rem;
}
</style>

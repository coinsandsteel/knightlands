<template>
  <UserDialog :title="$t('unit-details')" @close="close">
    <template v-slot:content>
      <div v-if="unit" class="font-size-22">
        <div class="margin-top-2">
          <BattleUnit :unit="unit" :is-enemy="isEnemy" />
        </div>
        <div class="margin-top-1 font-size-30">
          {{ unit.unitTribe }} {{ unit.unitClass }}
        </div>
        <div class="margin-top-2">
          <div
            class="flex flex-justify-center flex-evenly-spaced width-75 padding-1 margin-left-auto margin-right-auto"
          >
            <div class="flex flex-column width-35 margin-bottom-1">
              <div>Tier: {{ unit.tier }}</div>
              <div>Level: {{ unit.levelInt }}</div>
              <div>Hp: {{ unit.hp }}</div>
              <div>Defense: {{ unit.characteristics.defence }}</div>
            </div>
            <div class="flex flex-column width-35 margin-bottom-1">
              <div>Damage: {{ unit.characteristics.damage }}</div>
              <div>Speed: {{ unit.characteristics.speed }}</div>
              <div>Initiative: {{ unit.characteristics.initiative }}</div>
            </div>
          </div>
        </div>
        <div class="margin-top-3">
          <div>Abilities</div>
          <BattleUnitAbilityDetails
            v-for="(ability, index) in abilities"
            :key="ability.abilityType + ability.abilityClass"
            :unit="unit"
            :ability="ability"
            class="padding-left-1"
            :class="{ 'margin-top-2': index > 0 }"
          >
          </BattleUnitAbilityDetails>
        </div>
      </div>
    </template>
  </UserDialog>
</template>

<script>
import { mapGetters } from "vuex";
import BattleUnit from "@/views/Battle/BattleUnit.vue";
import BattleUnitAbilityDetails from "@/views/Battle/BattleUnitAbilityDetails.vue";
import * as battle from "@/../../knightlands-shared/battle";

export default {
  components: {
    BattleUnit,
    BattleUnitAbilityDetails
  },
  props: { fighterId: String },
  computed: {
    ...mapGetters("battle", ["units", "enemyUnits"]),
    isEnemy() {
      return !!this.enemyUnits.find(
        ({ fighterId }) => fighterId === this.fighterId
      );
    },
    unit() {
      return [...this.units, ...this.enemyUnits].find(
        ({ fighterId }) => fighterId === this.fighterId
      );
    },
    expValue() {
      return this.unit && this.unit.expirience
        ? this.unit.expirience.currentLevelExp || 0
        : 0;
    },
    expMaxValue() {
      const next =
        this.unit && this.unit.expirience
          ? this.unit.expirience.nextLevelExp || 0
          : 0;
      return next;
    },
    abilities() {
      return (this.unit && this.unit.abilities
        ? this.unit.abilities
        : []
      ).filter(({ enabled }) => enabled);
    },
    level() {
      return this.unit && this.unit.level ? this.unit.level.current : "";
    }
  },
  methods: {
    close() {
      this.$close();
    }
  }
};
</script>

<style lang="less" scoped>
.battle-unit {
  width: 100px;
  margin: 0 auto;
}
.battle-squad-unit-info {
  display: grid;
  grid-template-columns: repeat(2, 50%);
}
</style>

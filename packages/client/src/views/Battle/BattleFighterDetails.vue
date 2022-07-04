<template>
  <UserDialog :title="$t('unit-details')" @close="close">
    <template v-slot:content>
      <div v-if="unit" class="font-size-22">
        <div class="margin-top-2">
          <BattleUnit :unit="unit" :is-enemy="isEnemy" />
        </div>
        <div class="margin-top-1 font-size-30">
          # {{ unit.unitTribe }} {{ unit.unitClass }} #
        </div>
        <div class="margin-top-2">
          <div>Tier: {{ unit.tier }}</div>
          <!-- <div>HLevel: {{ level }}</div> -->
          <div>Hp - {{ unit.hp }}</div>
          <!-- <div>Defense - {{ unit.characteristics.damage }}</div> -->
          <!-- <div>Damage - {{ unit.characteristics.defence }}</div> -->
          <!-- <div>Speed - {{ unit.characteristics.initiative }}</div> -->
          <!-- <div>Initiative - {{ unit.characteristics.speed }}</div> -->
        </div>
        <div class="margin-top-3">
          <div>Abilities</div>
          <BattleUnitAbilityDetails
            v-for="(ability, index) in abilities"
            :key="ability.abilityType + ability.abilityClass"
            :unit="unit"
            :ability="ability"
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

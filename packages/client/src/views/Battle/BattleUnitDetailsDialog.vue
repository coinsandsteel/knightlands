<template>
  <UserDialog title="unit details" :emitClose="true" @close="close()">
    <template v-slot:content>
      <div v-if="unit" class="font-size-22">
        <div
          class="battle-unit-details-wrapper margin-x-auto flex flex-no-wrap padding-left-2 flex-center"
        >
          <div class="">
            <BattleUnit :unit="unit" class="margin-x-auto" />
            <!-- <div class="font-size-22 text-align-center white-space-no-wrap">
              <template v-if="unit.name">
                {{ unit.name }}
              </template>
              <div>
                # {{ $t("battle-unit-tribe-" + unit.tribe) }}
                {{ $t("battle-unit-class-" + unit.class) }} #
              </div>
            </div> -->
          </div>
          <div class="_flex-grow-1 text-align-left _width-35 margin-left-2">
            <div class="margin-top-half">{{ unit.name }}</div>
            <div>
              {{ $t("battle-unit-tribe-" + unit.tribe) }}
              {{ $t("battle-unit-class-" + unit.class) }}
            </div>
            <div class="">Tier: {{ unit.tier }}</div>
            <div>Level: {{ unit.levelInt }}</div>
            <div>Power: {{ unit.power }}</div>
            <!-- <div class="margin-top-1">Hp: {{ unit.characteristics.hp }}</div>
            <div>Attack: {{ unit.characteristics.damage }}</div>
            <div>Defence: {{ unit.characteristics.defence }}</div>
            <div>Speed: {{ unit.characteristics.speed }}</div>
            <div>Initiative: {{ unit.characteristics.initiative }}</div> -->
          </div>
          <div class="_flex-grow-1 text-align-left _width-35 margin-left-2">
            <!-- <div class="margin-top-half">Tier: {{ unit.tier }}</div>
            <div>Level: {{ unit.levelInt }}</div>
            <div>Power: {{ unit.power }}</div> -->
            <div class="margin-top-half">Hp: {{ unit.characteristics.hp }}</div>
            <div>Attack: {{ unit.characteristics.damage }}</div>
            <div>Defence: {{ unit.characteristics.defence }}</div>
            <div>Speed: {{ unit.characteristics.speed }}</div>
            <div>Initiative: {{ unit.characteristics.initiative }}</div>
          </div>
        </div>
        <div
          class="battle-unit-abilities-wrapper margin-top-3 padding-bottom-2"
        >
          <div class="margin-bottom-1">Abilities</div>
          <BattleUnitAbilityDetails
            v-for="(ability, index) in abilities"
            :key="ability.abilityType + ability.abilityClass"
            :unit="unit"
            :ability="ability"
            :shouldUseCombatValue="true"
            :isUpgradeVisible="false"
            :class="{ 'margin-top-2': index > 0 }"
          >
          </BattleUnitAbilityDetails>
        </div>

        <div
          v-if="isSelectButtonVisible"
          class="text-align-center margin-top-4"
        >
          <CustomButton
            type="green"
            class="inline-block"
            width="15rem"
            @click="close(true)"
          >
            Select Unit
          </CustomButton>
        </div>
      </div>
    </template>
  </UserDialog>
</template>

<script>
// import { mapGetters } from "vuex";
import BattleUnit from "@/views/Battle/BattleUnit.vue";
// import BattleUnitBuff from "@/views/Battle/BattleUnitBuff.vue";

import BattleUnitAbilityDetails from "@/views/Battle/BattleUnitAbilityDetails.vue";
// import * as battle from "@/../../knightlands-shared/battle";

export default {
  components: {
    BattleUnit,
    // BattleUnitBuff
    BattleUnitAbilityDetails
  },
  props: {
    unit: Object,
    isSelectButtonVisible: { type: Boolean, default: true }
  },
  computed: {
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
      return this.unit && this.unit.abilities ? this.unit.abilities : [];
    },
    level() {
      return this.unit && this.unit.level ? this.unit.level.current : "";
    }
  },
  methods: {
    close(result = false) {
      this.$close(result);
    }
  }
};
</script>

<style lang="less" scoped>
.battle-unit-details-wrapper {
  // width: 250px;
}
.battle-unit-abilities-wrapper {
  width: 280px;
  margin-left: auto;
  margin-right: auto;
}
.buff-description {
  max-width: 210px;
}
.battle-unit {
  width: 100px;
  margin: 0 auto;
}
.battle-squad-unit-info {
  display: grid;
  grid-template-columns: repeat(2, 50%);
}
::v-deep .ability-value {
  display: none;
}
</style>

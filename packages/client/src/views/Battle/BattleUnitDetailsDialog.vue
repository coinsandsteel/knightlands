<template>
  <UserDialog :title="unit ? unit.name : ''" :emitClose="true" @close="close()">
    <template v-slot:content>
      <div v-if="unit" class="font-size-22">
        <!-- <div
          class="battle-unit-details-wrapper margin-x-auto flex flex-no-wrap flex-center margin-bottom-2 font-shadow font-weight-700"
          :class="'battle-unit-tribe--' + unit.tier"
        >
          <div>
            {{ $t("battle-unit-tribe-" + unit.tribe) }}
            {{ $t("battle-unit-class-" + unit.class) }}
          </div>
        </div> -->
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
          <div class="_flex-grow-1 text-align-left _width-35 margin-left-3">
            <!-- tribe -->
            <div
              class="text-align-left font-weight-700 font-shadow"
              :class="'battle-unit-tribe--' + unit.tier"
            >
              <div>
                {{ $t("battle-unit-tribe-" + unit.tribe) }}
                {{ $t("battle-unit-class-" + unit.class) }}
              </div>
            </div>
            <div class="flex flex-no-wrap">
              <div>
                <!-- <div class="margin-top-half">{{ unit.name }}</div>
            <div>
              {{ $t("battle-unit-tribe-" + unit.tribe) }}
              {{ $t("battle-unit-class-" + unit.class) }}
            </div> -->
                <!-- tier -->
                <!-- <div>Tier: {{ unit.tier }}</div> -->
                <div class="flex flex-no-wrap">
                  <div class="font-shadow">
                    Tier
                  </div>
                  <div
                    class="flex-grow-1 font-size-20 padding-left-2 text-align-right characteristic-value font-shadow"
                  >
                    {{ unit.tier }}
                  </div>
                </div>
                <!-- level -->
                <!-- <div>Level: {{ unit.levelInt }}</div> -->
                <div class="flex flex-no-wrap">
                  <div class="font-shadow">
                    Level
                  </div>
                  <div
                    class="flex-grow-1 font-size-20 padding-left-2 text-align-right characteristic-value font-shadow"
                  >
                    {{ unit.levelInt }}
                  </div>
                </div>
                <!-- power -->
                <!-- <div>Power: {{ unit.power }}</div> -->
                <div class="flex flex-no-wrap">
                  <div class="font-shadow">
                    Power
                  </div>
                  <div
                    class="flex-grow-1 font-size-20 padding-left-2 text-align-right characteristic-value font-shadow"
                  >
                    {{ unit.power }}
                  </div>
                </div>
                <!-- hp -->
                <!-- <div>Hp: {{ unit.characteristics.hp }}</div> -->
                <div class="flex flex-no-wrap">
                  <div class="font-shadow">
                    Hp
                  </div>
                  <div
                    class="flex-grow-1 font-size-20 padding-left-2 text-align-right characteristic-value font-shadow"
                  >
                    {{ unit.characteristics.hp }}
                  </div>
                </div>
                <!-- <div class="margin-top-1">Hp: {{ unit.characteristics.hp }}</div>
            <div>Attack: {{ unit.characteristics.damage }}</div>
            <div>Defence: {{ unit.characteristics.defence }}</div>
            <div>Speed: {{ unit.characteristics.speed }}</div>
            <div>Initiative: {{ unit.characteristics.initiative }}</div> -->
              </div>
              <div class="_flex-grow-1 text-align-left _width-35 margin-left-3">
                <!-- <div class="margin-top-half">Tier: {{ unit.tier }}</div>
            <div>Level: {{ unit.levelInt }}</div>
            <div>Power: {{ unit.power }}</div> -->
                <!-- attack -->
                <!-- <div>Attack: {{ unit.characteristics.damage }}</div> -->
                <div class="flex flex-no-wrap">
                  <div class="font-shadow">
                    Attack
                  </div>
                  <div
                    class="flex-grow-1 font-size-20 padding-left-2 text-align-right characteristic-value font-shadow"
                  >
                    {{ unit.characteristics.damage }}
                  </div>
                </div>
                <!-- defense -->
                <!-- <div>Defence: {{ unit.characteristics.defence }}</div> -->
                <div class="flex flex-no-wrap">
                  <div class="font-shadow">
                    Defence
                  </div>
                  <div
                    class="flex-grow-1 font-size-20 padding-left-2 text-align-right characteristic-value font-shadow"
                  >
                    {{ unit.characteristics.defence }}
                  </div>
                </div>
                <!-- speed -->
                <!-- <div>Speed: {{ unit.characteristics.speed }}</div> -->
                <div class="flex flex-no-wrap">
                  <div class="font-shadow">
                    Speed
                  </div>
                  <div
                    class="flex-grow-1 font-size-20 padding-left-2 text-align-right characteristic-value font-shadow"
                  >
                    {{ unit.characteristics.speed }}
                  </div>
                </div>
                <!-- initiative -->
                <!-- <div>Initiative: {{ unit.characteristics.initiative }}</div> -->
                <div class="flex flex-no-wrap">
                  <div class="font-shadow">
                    Initiative
                  </div>
                  <div
                    class="flex-grow-1 font-size-20 padding-left-2 text-align-right characteristic-value font-shadow"
                  >
                    {{ unit.characteristics.initiative }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Title
          class="abilities-title common-title  margin-top-4 margin-bottom-2"
          >Abilities</Title
        >
        <div class="battle-unit-abilities-wrapper padding-bottom-2">
          <!-- <div class="margin-bottom-1">Abilities</div> -->
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
          class="text-align-center margin-top-3"
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
    damage() {
      if (!this.unit) {
        return 0;
      }
      const attackAbility = this.unit.abilities.find(
        ({ abilityClass }) => abilityClass === "attack"
      );
      if (attackAbility) {
        return Math.round(attackAbility.combatValue * 100) / 100;
      }
      return this.unit.characteristics.damage;
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
.battle-unit-tribe--1 {
  color: #70ee70;
}
.battle-unit-tribe--2 {
  color: #38bdf8;
}
.battle-unit-tribe--3 {
  color: #c965ee;
}
.characteristic-value {
  color: #f4eb02;
}
</style>

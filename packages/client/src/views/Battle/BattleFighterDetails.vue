<template>
  <UserDialog @close="close">
    <template v-slot:content>
      <div
        v-if="unitRecord"
        class="battle-fighter-details-container font-size-22"
      >
        <Title
          v-if="unitRecord"
          class="abilities-title common-title margin-top-2 margin-bottom-2"
          >{{ unitRecord.name + (unitRecord.isBoss ? " - Boss" : "") }}</Title
        >
        <div
          class="battle-fighter-details-wrapper margin-x-auto flex flex-center flex-wrap margin-bottom-2 font-weight-700 font-shadow"
          :class="'battle-unit-tribe--' + unitRecord.tier"
        >
          <div>
            {{ $t("battle-unit-tribe-" + unitRecord.tribe) }}
            {{ $t("battle-unit-class-" + unitRecord.class) }}, level {{ level }}
          </div>
        </div>
        <div
          class="battle-fighter-details-wrapper margin-x-auto flex flex-center flex-no-wrap"
        >
          <div class="">
            <BattleUnit
              :unit="unit"
              :is-enemy="isEnemy"
              class="margin-x-auto"
            />
            <!-- <div class="font-size-22 text-align-center white-space-no-wrap">
              <template v-if="unit.name">
                {{ unit.name }} {{ unit.isBoss ? "- Boss" : "" }}
              </template>
              <div>
                # {{ $t("battle-unit-tribe-" + unit.tribe) }}
                {{ $t("battle-unit-class-" + unit.class) }} #
              </div>
            </div> -->
          </div>
          <div class="text-align-left width-35 margin-left-2">
            <!-- <div>Tier: {{ unit.tier }}</div>
              <div>Level: {{ unit.levelInt }}</div> -->
            <!-- hp -->
            <div class="flex flex-no-wrap">
              <div class="_uppercase _font-size-20 font-shadow">
                Hp
              </div>
              <div
                class="flex-grow-1 font-size-20 padding-left-2 text-align-right characteristic-value font-shadow"
              >
                <BattleCharacteristicValue :value="hp" :baseValue="baseHp" />
              </div>
            </div>
            <!-- attack -->
            <div class="flex flex-no-wrap">
              <div class="_uppercase _font-size-20 font-shadow">
                Attack
              </div>
              <div
                class="flex-grow-1 font-size-20 padding-left-2 text-align-right characteristic-value font-shadow"
              >
                <BattleCharacteristicValue
                  :value="damage"
                  :baseValue="baseDamage"
                />
              </div>
            </div>
            <!-- defence -->
            <div class="flex flex-no-wrap">
              <div class="_uppercase _font-size-20 font-shadow">
                Defence
              </div>
              <div
                class="flex-grow-1 font-size-20 padding-left-2 text-align-right characteristic-value font-shadow"
              >
                <BattleCharacteristicValue
                  :value="defence"
                  :baseValue="baseDefence"
                />
              </div>
            </div>
            <!-- speed -->
            <div class="flex flex-no-wrap">
              <div class="_uppercase _font-size-20 font-shadow">
                Speed
              </div>
              <div
                class="flex-grow-1 font-size-20 padding-left-2 text-align-right characteristic-value font-shadow"
              >
                <BattleCharacteristicValue
                  :value="speed"
                  :baseValue="baseSpeed"
                />
              </div>
            </div>
            <!-- speed -->
            <div class="flex flex-no-wrap">
              <div class="_uppercase _font-size-20 font-shadow">
                Initiative
              </div>
              <div
                class="flex-grow-1 font-size-20 padding-left-2 text-align-right characteristic-value font-shadow"
              >
                <BattleCharacteristicValue
                  :value="initiative"
                  :baseValue="baseInitiative"
                />
              </div>
            </div>
          </div>
        </div>

        <Title
          v-if="abilities && abilities.length > 0"
          class="abilities-title common-title margin-top-3 margin-bottom-2"
          >Abilities</Title
        >
        <div
          v-if="abilities && abilities.length > 0"
          class="battle-unit-abilities-wrapper padding-bottom-2"
        >
          <BattleUnitAbilityDetails
            v-for="(ability, index) in abilities"
            :key="ability.abilityType + ability.abilityClass"
            :unit="unit"
            :ability="ability"
            :isUpgradeVisible="false"
            :shouldUseCombatValue="true"
            :class="{ 'margin-top-2': index > 0 }"
          >
          </BattleUnitAbilityDetails>
        </div>
        <Title
          v-if="buffItems.length"
          class="abilities-title common-title margin-top-2 margin-bottom-2"
          >Buff / Debuff</Title
        >
        <div
          v-if="buffItems.length"
          class="battle-fighter-buff-wrapper margin-x-auto _text-align-left font-size-22"
        >
          <div
            v-for="(buff, buffIndex) in buffItems"
            :key="buff.source + '_' + buff.sourceId + '_' + buffIndex"
            class="flex flex-center flex-no-wrap margin-bottom-1"
          >
            <BattleUnitBuff class="flex-shrink-0" :buff="buff" />
            <div
              class="flex-grow-1 text-align-left buff-description padding-left-1"
            >
              {{
                buff &&
                buff.sourceId &&
                "caseId" in buff &&
                BUFFS[buff.sourceId]
                  ? BUFFS[buff.sourceId].cases[buff.caseId]
                  : ""
              }}
            </div>
          </div>
        </div>
      </div>
    </template>
  </UserDialog>
</template>

<script>
import { mapGetters } from "vuex";
import BattleUnit from "@/views/Battle/BattleUnit.vue";
import BattleUnitBuff from "@/views/Battle/BattleUnitBuff.vue";
import BattleUnitAbilityDetails from "@/views/Battle/BattleUnitAbilityDetails.vue";
import BattleCharacteristicValue from "@/views/Battle/BattleCharacteristicValue.vue";

// import BattleUnitAbilityDetails from "@/views/Battle/BattleUnitAbilityDetails.vue";
import * as battle from "@/../../knightlands-shared/battle";

export default {
  components: {
    BattleUnit,
    BattleUnitBuff,
    BattleUnitAbilityDetails,
    BattleCharacteristicValue
  },
  props: { fighterId: String },
  computed: {
    ...mapGetters("battle", ["fighters", "enemyFighters"]),
    BUFFS() {
      return battle.BUFFS;
    },
    buffItems() {
      if (!this.unit) {
        return [];
      }

      return this.unit.buffs.filter(
        buff => buff && buff.source && buff.sourceId && buff.source !== "squad"
      );
    },
    isEnemy() {
      return !!this.enemyFighters.find(
        fighter => fighter && fighter.fighterId === this.fighterId
      );
    },
    unit() {
      return [...this.fighters, ...this.enemyFighters].find(
        fighter => fighter && fighter.fighterId === this.fighterId
      );
    },
    unitRecord() {
      return this.unit && this.unit.unit ? this.unit.unit : this.unit;
    },
    abilities() {
      return (this.unitRecord && this.unitRecord.abilities
        ? this.unitRecord.abilities
        : []
      ).filter(({ enabled }) => enabled);
    },
    expValue() {
      return this.unitRecord && this.unitRecord.expirience
        ? this.unitRecord.expirience.currentLevelExp || 0
        : 0;
    },
    expMaxValue() {
      const next =
        this.unitRecord && this.unitRecord.expirience
          ? this.unitRecord.expirience.nextLevelExp || 0
          : 0;
      return next;
    },
    level() {
      return this.unitRecord && this.unitRecord.level
        ? this.unitRecord.level.current
        : "";
    },
    hp() {
      if (!this.unit) {
        return 0;
      }
      return Math.max(0, this.unit.hp);
    },
    damage() {
      if (!this.unitRecord) {
        return 0;
      }
      const attackAbility = this.unitRecord.abilities.find(
        ({ abilityClass }) => abilityClass === "attack"
      );
      if (attackAbility) {
        return Math.round(attackAbility.combatValue * 100) / 100;
      }
      return this.unitRecord.characteristics.damage;
    },
    defence() {
      if (!this.unit) {
        return 0;
      }
      return this.unit.characteristics.defence;
    },
    speed() {
      if (!this.unit) {
        return 0;
      }
      return this.unit.characteristics.speed;
    },
    initiative() {
      if (!this.unit) {
        return 0;
      }
      return this.unit.characteristics.initiative;
    },
    baseHp() {
      if (!this.unit) {
        return 0;
      }
      return Math.max(0, this.unit.hp);
    },
    baseDamage() {
      if (!this.unitRecord) {
        return 0;
      }
      const attackAbility = this.unitRecord.abilities.find(
        ({ abilityClass }) => abilityClass === "attack"
      );
      if (attackAbility) {
        return Math.round(attackAbility.combatValue * 100) / 100;
      }
      return this.unitRecord.characteristics.damage;
    },
    baseDefence() {
      if (!this.unit) {
        return 0;
      }
      return this.unit.characteristics.defence;
    },
    baseSpeed() {
      if (!this.unit) {
        return 0;
      }
      return this.unit.characteristics.speed;
    },
    baseInitiative() {
      if (!this.unit) {
        return 0;
      }
      return this.unit.characteristics.initiative;
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
.battle-fighter-details-container {
  max-height: 62vh;
  overflow: auto;
}
.battle-fighter-details-wrapper {
  width: 250px;
}
.battle-fighter-buff-wrapper {
  width: 280px;
}
// .buff-description {
//   max-width: 250px;
// }
.battle-unit {
  width: 100px;
  margin: 0 auto;
}
.battle-squad-unit-info {
  display: grid;
  grid-template-columns: repeat(2, 50%);
}
.battle-unit-abilities-wrapper {
  width: 280px;
  margin-left: auto;
  margin-right: auto;
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

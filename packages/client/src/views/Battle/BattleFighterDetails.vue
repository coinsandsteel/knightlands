<template>
  <UserDialog title="unit details" @close="close">
    <template v-slot:content>
      <div v-if="unit" class="font-size-22">
        <div
          class="battle-fighter-details-wrapper margin-x-auto flex flex-wrap padding-left-2"
        >
          <div class="">
            <BattleUnit
              :unit="unit"
              :is-enemy="isEnemy"
              class="margin-x-auto"
            />
            <div class="font-size-22 text-align-center white-space-no-wrap">
              <template v-if="unit.name">
                {{ unit.name }}
              </template>
              <div>
                # {{ $t("battle-unit-tribe-" + unit.tribe) }}
                {{ $t("battle-unit-class-" + unit.class) }} #
              </div>
            </div>
          </div>
          <div class="flex-grow-1 text-align-left width-35 margin-left-2">
            <!-- <div>Tier: {{ unit.tier }}</div>
              <div>Level: {{ unit.levelInt }}</div> -->
            <div>Hp: {{ unit.hp }}</div>
            <div>Damage: {{ unit.characteristics.damage }}</div>
            <div>Defense: {{ unit.characteristics.defence }}</div>
            <div>Speed: {{ unit.characteristics.speed }}</div>
            <div>Initiative: {{ unit.characteristics.initiative }}</div>
          </div>
        </div>
        <div
          v-if="buffItems.length"
          class="battle-fighter-details-wrapper margin-x-auto text-align-left margin-top-2 font-size-22 padding-left-2"
        >
          <div
            v-for="(buff, buffIndex) in buffItems"
            :key="buff.source + '_' + buff.sourceId + '_' + buffIndex"
            class="flex flex-center flex-nowrap margin-bottom-1"
          >
            <BattleUnitBuff :buff="buff" />
            <div class="flex-grow-1 buff-description padding-left-1">
              {{
                buff && buff.sourceId && "caseId" in buff
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

// import BattleUnitAbilityDetails from "@/views/Battle/BattleUnitAbilityDetails.vue";
import * as battle from "@/../../knightlands-shared/battle";

export default {
  components: {
    BattleUnit,
    BattleUnitBuff
    // BattleUnitAbilityDetails
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
        ({ fighterId }) => fighterId === this.fighterId
      );
    },
    unit() {
      return [...this.fighters, ...this.enemyFighters].find(
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
.battle-fighter-details-wrapper {
  width: 250px;
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
</style>

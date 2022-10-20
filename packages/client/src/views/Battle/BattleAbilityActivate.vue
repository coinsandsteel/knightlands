<template>
  <UserDialog
    :title="ability ? $t('battle-ability-' + ability.abilityClass) : ''"
    @close="close()"
  >
    <template v-slot:content>
      <div v-if="ability" class="font-size-22">
        <div
          class="battle-ability-details-wrapper margin-x-auto flex flex-wrap flex-center padding-left-2"
        >
          <div>
            <BattleUnitAbility
              :ability="ability"
              class="battle-ability-icon pointer"
            />
            <!-- <div class="font-size-22 text-align-center white-space-no-wrap">
              {{ $t("battle-ability-" + ability.abilityClass) }}
            </div> -->
            <!-- <div class="font-size-22 text-align-center white-space-no-wrap">
              Level:
              {{ ability.levelInt || (ability.level && ability.level.current) }}
            </div> -->
          </div>
          <div
            class="flex-grow-1 flex flex-column flex-justify-center text-align-left width-35 margin-left-2 _margin-top--5"
          >
            <!-- <div>Tier: {{ unit.tier }}</div>
              <div>Level: {{ unit.levelInt }}</div> -->
            <!-- <div>Hp: {{ "" }}</div> -->
            <div>
              Level:
              {{ ability.levelInt || (ability.level && ability.level.current) }}
            </div>
            <div v-if="['attack', 'healing'].includes(ability.abilityType)">
              Damage/Heal: {{ ability.combatValue | rounded2Decimal }}
            </div>
            <div>Effect: {{ effect }}</div>
            <div v-if="ability.cooldown && ability.cooldown.estimate">
              Cooldown:
              {{
                ability.cooldown.estimate +
                  (ability.cooldown.estimate > 1 ? " turns" : " turn")
              }}
            </div>
            <div>
              {{ $t("battle-ability-description-" + ability.abilityClass) }}
            </div>
          </div>
        </div>
      </div>
      <div v-if="canActivate" class="text-align-center margin-top-4">
        <CustomButton
          type="green"
          class="inline-block"
          width="15rem"
          @click="close(true)"
        >
          Activate
        </CustomButton>
      </div>
    </template>
  </UserDialog>
</template>

<script>
import * as battle from "@/../../knightlands-shared/battle";
import BattleUnitAbility from "@/views/Battle/BattleUnitAbility.vue";

export default {
  components: {
    BattleUnitAbility
  },
  props: { ability: Object },
  computed: {
    effect() {
      if (this.ability) {
        switch (this.ability.abilityClass) {
          case battle.ABILITY_STUN:
          case battle.ABILITY_STUN_SHOT:
          case battle.ABILITY_SHIELD_STUN:
            return "stun";
          case battle.ABILITY_RAGE:
          case battle.ABILITY_ZEALOT:
          case battle.ABILITY_HEAVY_ARROW:
          case battle.ABILITY_MIGHT:
            return "increase damage";
          case battle.ABILITY_WEAKNESS:
            return "decrease damage";
          case battle.ABILITY_SHIELD_WALL:
          case battle.ABILITY_SHIELD:
            return "increase defence";
          case battle.ABILITY_CURSE:
            return "decrease defence";
          case battle.ABILITY_WIND_WALK:
            return "increase speed";
          case battle.ABILITY_LAZINESS:
            return "decrease initiative";
          case battle.ABILITY_AGRESSION:
            return "force attack";

          default:
            break;
        }
      }
      return "No";
    },
    canActivate() {
      return (
        this.ability &&
        this.ability.abilityType === battle.ABILITY_TYPE_SELF_BUFF
      );
    }
  },
  filters: {
    rounded2Decimal(value) {
      return Math.round(value * 100) / 100;
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
.battle-ability-details-wrapper {
  width: 300px;
}
.battle-ability-icon {
  width: 100px;
  height: 100px;
  border-radius: 50%;
}
</style>

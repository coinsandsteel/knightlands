<template>
  <UserDialog
    @close="$close"
    :title="$t('stats-details')"
    :disableScroll="true"
  >
    <template v-slot:content>
      <div class="flex flex-column">
        <div class="flex flex-column flex-center">
          <span class="font-size-20 font-shadow margin-bottom-half">{{
            $t("character-level", { level: level })
          }}</span>

          <IconWithValue iconClass="icon-exp" valueClass="font-size-20">
            {{ $t("char-exp", { c: currentExp, n: nextExp }) }}
          </IconWithValue>
        </div>

        <div class="flex flex-no-wrap full-flex flex-space-around font-size-20">
          <div
            class="flex flex-no-wrap flex-column text-align-right flex-space-evenly flex-start flex-basis-45 text-align-left"
          >
            <span
              class="margin-bottom-half"
              v-for="stat in stats"
              :key="stat"
              >{{ $t(stat) }}</span
            >
          </div>

          <div
            class="flex flex-no-wrap flex-column flex-space-evenly flex-start flex-basis-45 text-align-left"
          >
            <span v-for="stat in stats" :key="stat" class="margin-bottom-half">
              {{ format(stat, finalStats[stat]) }}
              <span class="rarity-rare" v-if="bonusStats[stat] > 0"
                >(+{{ format(stat, bonusStats[stat]) }})</span
              >
            </span>
          </div>
        </div>
      </div>
    </template>
  </UserDialog>
</template>

<script>
import UserDialog from "@/components/UserDialog.vue";
import StatsFormatter from "@/components/Item/StatsFormatter.vue";
import CharacterStat from "@/../../knightlands-shared/character_stat";
import IconWithValue from "@/components/IconWithValue.vue";

export default {
  props: ["maxStats"],
  mixins: [StatsFormatter],
  components: { UserDialog, IconWithValue },
  computed: {
    stats() {
      let stats = [];
      stats.push(CharacterStat.Health);
      stats.push(CharacterStat.Attack);
      stats.push(CharacterStat.Defense);
      stats.push(CharacterStat.DamageReduction);

      stats.push(CharacterStat.CriticalChance);
      stats.push(CharacterStat.CriticalDamage);
      stats.push(CharacterStat.Dodge);
      // stats.push(CharacterStat.HitRating);
      stats.push(CharacterStat.ArmyDamage);

      stats.push(CharacterStat.Energy);
      stats.push(CharacterStat.Stamina);

      stats.push(CharacterStat.Luck);
      stats.push(CharacterStat.ExtraGold);
      stats.push(CharacterStat.ExtraExp);
      stats.push(CharacterStat.ExtraDkt);

      return stats;
    },
    finalStats() {
      return this.maxStats || this.$game.character.maxStats;
    },
    bonusStats() {
      if (this.maxStats) {
        return {};
      }
      return this.$game.character.buffResolver.bonuses;
    },
    level() {
      return this.$game.character.level;
    },
    currentExp() {
      return this.$game.character.exp;
    },
    nextExp() {
      return this.$game.getRequiredExperience(this.$game.character.level);
    }
  }
};
</script>

<style lang="less" scoped>
.mask {
  background-color: rgba(0, 0, 0, 0.555);
  z-index: 900;
}
</style>

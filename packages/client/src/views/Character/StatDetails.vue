<template>
  <UserDialog @close="$close" :title="$t('stats-details')" :disableScroll="true">
    <template v-slot:content>
      <div class="flex flex-no-wrap full-flex flex-space-around font-size-20">
        <div
          class="flex flex-no-wrap flex-column text-align-right flex-space-evenly flex-start flex-basis-45 text-align-left"
        >
          <span class="margin-bottom-half" v-for="stat in stats" :key="stat">{{$t(stat)}}</span>
        </div>

        <div
          class="flex flex-no-wrap flex-column flex-space-evenly flex-start flex-basis-45 text-align-left"
        >
          <span v-for="stat in stats" :key="stat" class="margin-bottom-half">
            {{finalStats[stat]}}
            <span class="rarity-rare" v-if="bonusStats[stat] > 0">(+{{bonusStats[stat]}})</span>
          </span>
        </div>
      </div>
    </template>
  </UserDialog>
</template>

<script>
import UserDialog from "@/components/UserDialog.vue";
import CharacterStat from "@/../../knightlands-shared/character_stat";

export default {
  components: { UserDialog },
  computed: {
    stats() {
      let stats = [];
      stats.push(CharacterStat.Health);
      stats.push(CharacterStat.Attack);
      stats.push(CharacterStat.Defense);

      stats.push(CharacterStat.CriticalChance);
      stats.push(CharacterStat.CriticalDamage);
      stats.push(CharacterStat.Dodge);
      stats.push(CharacterStat.HitRating);
      stats.push(CharacterStat.RaidDamage);

      stats.push(CharacterStat.Energy);
      stats.push(CharacterStat.Stamina);

      stats.push(CharacterStat.Luck);
      stats.push(CharacterStat.ExtraGold);
      stats.push(CharacterStat.ExtraExp);
      stats.push(CharacterStat.ExtraDkt);

      return stats;
    },
    finalStats() {
      return this.$game.character.maxStats;
    },

    bonusStats() {
      return this.$game.character.buffResolver.bonusStats;
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

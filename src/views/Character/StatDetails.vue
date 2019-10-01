<template>
  <UserDialog @close="$close" :title="$t('stats-details')" :disableScroll="true">
    <template v-slot:content>
      <div class="flex flex-no-wrap full-flex flex-space-around font-size-20">
        <div
          class="flex flex-no-wrap flex-column text-align-right flex-space-evenly flex-start flex-basis-45 text-align-left"
        >
          <span v-for="(stat, key) in finalStats" :key="key" class>{{$t(key)}}</span>
        </div>

        <div
          class="flex flex-no-wrap flex-column flex-space-evenly flex-start flex-basis-45 text-align-left"
        >
          <span
            v-for="(stat, key) in bonusStats"
            :key="key"
            class="attribute"
          >{{finalStats[key]}} <span class="rarity-rare" v-if="stat > 0">(+{{stat}})</span></span>
        </div>
      </div>
    </template>
  </UserDialog>
</template>

<script>
import UserDialog from "@/components/UserDialog.vue";

export default {
  components: { UserDialog },
  computed: {
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
<template>
  <div
    class="item-info-stats margin-bottom-2 margin-top-1 flex flex-center font-size-20 flex-space-evenly"
  >
    <div class="flex width-40 flex-column flex-item-end text-align-right">
      <div
        v-for="(statValue, statId) in stats"
        :key="statId"
        class="margin-bottom-half width-100"
      >
        {{ $t(statId) }}
      </div>
    </div>
    <div class="flex width-40 flex-column text-align-left">
      <div
        v-for="(statValue, statId) in stats"
        :key="statId"
        class="margin-bottom-half flex flex-center flex-start width-100"
      >
        {{ statValue }}
        <span class="margin-left-half margin-right-half right-arrow"></span>
        {{ futureStats[statId] }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["item", "nextLevel", "nextRarity"],
  computed: {
    stats() {
      return this.$game.itemsDB.getStats(this.item);
    },
    futureStats() {
      return this.$game.itemsDB.getStats(
        this.item,
        this.nextLevel,
        null,
        this.nextRarity
      );
    }
  }
};
</script>

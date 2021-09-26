<template>
  <div class="screen-content dummy-height flex-items-center width-100">
    <div
      class="title flex flex-center font-size-20 color-panel-2 padding-bottom-4"
    >
      <div class="flex margin-right-2">
        <span class="margin-right-half">{{ $t("your-rank") }}</span>
        <span class="green-title">{{ rank }}</span>
      </div>

      <div class="flex">
        <span class="margin-right-half">{{ $t("your-score") }}</span>
        <span class="yellow-title">{{ score }}</span>
      </div>
    </div>

    <Title :stackTop="true" :stackBottom="true">{{ $t("ppool-t") }}</Title>

    <div class="color-panel-1 padding-top-3 text-align-left flex flex-column">
      <div
        class="flex font-size-25 width-100 padding-left-3 padding-right-3 margin-bottom-1"
        v-for="(score, id) in stats"
        :key="id"
      >
        <span class="flex-3">{{ $t(`rank-t-${id}`) }}</span>
        <span class="flex-1">+{{ breakdown[id] || 0 }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import Title from "@/components/Title.vue";
import Meta from "@/prize_pool_meta";

export default {
  props: ["currentRank"],
  components: { Title },
  data: () => ({
    stats: {}
  }),
  mounted() {
    for (const stat of Meta) {
      this.$set(this.stats, stat, 0);
    }
  },
  computed: {
    score() {
      if (!this.currentRank) {
        return 0;
      }

      return this.currentRank.score;
    },
    breakdown() {
      const list = {};

      if (!this.currentRank) {
        return {};
      }

      for (const k in this.currentRank.b) {
        list[k] = this.currentRank.b[k];
      }
      return list;
    },
    rank() {
      if (!this.currentRank) {
        return this.$t("race-unranked");
      }

      if (this.currentRank.rank == 0) {
        return this.$t("race-unranked");
      }

      return this.currentRank.rank;
    }
  }
};
</script>

<style lang="less" scoped>
.even-bg {
  background-color: #303048;
}
</style>

<template>
  <div class="screen-content dummy-height flex-items-center width-100">
    <div class="flex flex-center font-size-30 margin-top-2 margin-bottom-3">
      {{ $t("total-ppoints", { s: score }) }}
    </div>

    <Title :stackBottom="true">{{ $t("ppool-t") }}</Title>

    <div class="color-panel-1 padding-top-3 text-align-left flex flex-column">
      <div
        class="flex font-size-22 width-100 padding-left-3 padding-right-3"
        v-for="b in breakdown"
        :key="b.id"
      >
        <span class="flex-3">{{ $t(`rank-t-${b.id}`) }}</span>
        <span class="flex-1">+{{ b.score }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import Title from "@/components/Title.vue";

export default {
  props: ["currentRank"],
  components: { Title },
  computed: {
    score() {
      if (!this.currentRank) {
        return 0;
      }

      return this.currentRank.score;
    },
    breakdown() {
      const list = [];

      if (!this.currentRank) {
        return;
      }

      for (const k in this.currentRank.b) {
        list.push({
          id: k,
          score: this.currentRank.b[k]
        });
      }
      list.sort((a, b) => {
        return b.score - a.score;
      });
      return list;
    }
  }
};
</script>

<style lang="less" scoped>
.even-bg {
  background-color: #303048;
}
</style>

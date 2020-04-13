<template>
  <div
    class="flex flex-item-center font-size-20 width-100 text-align-left"
    :class="[{'even-bg': (index+1)%2==0}, {'yellow-title': you}]"
  >
    <span :class="rankIcon" class="flex-1"></span>
    <span class="flex-1">#{{rank}}</span>
    <span class="flex flex-center flex-8">
        <Loot
          v-for="(r, index) in rewards"
          :key="index"
          :item="r.itemId"
          :quantity="r.minCount"
          @hint="handleHint"
        />
    </span>
  </div>
</template>

<script>
import Loot from "@/components/Loot.vue";
import HintHandler from "@/components/HintHandler.vue";

export default {
  props: ["index", "minRank", "maxRank", "you", "rewards"],
  mixins: [HintHandler],
  components: { Loot },
  computed: {
  rankIcon() {
      if (this.rank < 4) {
        return `icon-rank${this.rank}`;
      }

      return "";
    },
    rank() {
      if (this.minRank == this.maxRank) {
        return this.minRank;
      }

      return `${this.minRank} - ${this.maxRank}`;
    }
  }
};
</script>

<style lang="less" scoped>
.even-bg {
  background-color: #303048;
}
</style>
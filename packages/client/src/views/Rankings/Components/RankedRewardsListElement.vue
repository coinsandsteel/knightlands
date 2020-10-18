<template>
  <div
    class="flex flex-item-center font-size-20 width-100 text-align-left padding-top-1 padding-bottom-1"
    :class="[bgColor, { 'yellow-title': you }]"
  >
    <span :class="rankIcon" class="flex-1"></span>
    <span class="flex-2">#{{ rank }}</span>
    <span class="flex flex-center flex-8">
      <IconWithValue iconClass="icon-dkt big" v-if="dkt > 0">
        {{Math.floor(dkt * 10000)/1000}}
      </IconWithValue>
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
import IconWithValue from "@/components/IconWithValue.vue";

export default {
  props: ["index", "minRank", "maxRank", "you", "rewards", "dkt"],
  mixins: [HintHandler],
  components: { Loot, IconWithValue },
  computed: {
    bgColor() {
      return (this.index + 1) % 2 == 0 ? "even-bg" : "odd-bg";
    },
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
  background-color: #193f5f;
}
</style>

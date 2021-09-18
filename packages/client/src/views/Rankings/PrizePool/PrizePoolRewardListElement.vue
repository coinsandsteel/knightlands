<template>
  <div
    class="flex flex-item-center font-size-20 width-100 text-align-left padding-top-1 padding-bottom-1"
    :class="[bgColor, { 'yellow-title': you }]"
  >
    <span :class="rankIcon" class="r"></span>
    <span class="flex-5">#{{ rank }}</span>
    <span class="flex flex-5">
      <IconWithValue iconClass="icon-usdc big" v-if="reward > 0">
        {{ Math.floor(reward * 100) / 100 }}
      </IconWithValue>
    </span>
  </div>
</template>

<script>
import IconWithValue from "@/components/IconWithValue.vue";

export default {
  props: ["rank", "you", "reward"],
  components: { IconWithValue },
  computed: {
    bgColor() {
      return (this.rank + 1) % 2 == 0 ? "even-bg" : "odd-bg";
    },
    rankIcon() {
      if (this.rank < 4) {
        return `icon-rank${this.rank}`;
      }

      return "";
    }
  }
};
</script>

<style lang="less" scoped>
.r {
  width: 2.5rem;
}
.even-bg {
  background-color: #193f5f;
}
</style>

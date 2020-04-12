<template>
  <div
    class="flex flex-item-center font-size-20 width-100 text-align-left"
    :class="[{'even-bg': (index+1)%2==0}, {'yellow-title': you}]"
    :style="{'height': `${height}px`}"
  >
    <span :class="rankIcon" class="flex-1"></span>
    <span class="flex-1">#{{rank}}</span>
    <span class="flex-8">{{$game.shortAccount(id)}}</span>
    <span class="flex-3">{{score}}</span>
  </div>
</template>

<script>
export default {
  props: ["index", "id", "rank", "score", "height", "you", "target"],
  computed: {
    rankIcon() {
      if (this.target && this.score >= this.target) {
        return `icon-rank${this.rank}`;
      } else if (!this.target && this.rank < 4) {
        return `icon-rank${this.rank}`;
      }

      return "";
    }
  }
};
</script>

<style lang="less" scoped>
.even-bg {
  background-color: #303048;
}
</style>
<template>
  <div
    class="flex flex-item-center font-size-20 width-100 text-align-left pointer"
    :class="[{ 'even-bg': (index + 1) % 2 == 0 }, { 'yellow-title': you }]"
    :style="{ height: `${height}px` }"
    @click="preview"
  >
    <span :class="rankIcon" class="r"></span>
    <span class="flex-1">#{{ rank }}</span>
    <span class="icon-preview big"></span>
    <Avatar :preview="true" :avatar="avatar" :mini="true"></Avatar>
    <span class="flex-4">{{ id }}</span>
    <span class="flex-3">{{ scoreComputed }}</span>
    <!-- <span @click="preview" class="icon-preview flex-1 pointer"></span> -->
  </div>
</template>

<script>
import Avatar from "@/views/Character/Avatars/Avatar.vue";

export default {
  props: [
    "index",
    "id",
    "rank",
    "score",
    "height",
    "you",
    "target",
    "pId",
    "showRank",
    "avatar"
  ],
  components: { Avatar },
  computed: {
    scoreComputed() {
      const converted = Math.floor(this.score * 1000000) / 1000000;
      return isNaN(converted) ? this.score : converted;
    },
    rankIcon() {
      if (this.showRank) {
        if (this.target && this.score >= this.target) {
          return `icon-rank${this.rank}`;
        } else if (!this.target && this.rank < 4) {
          return `icon-rank${this.rank}`;
        }
      }

      return "";
    }
  },
  methods: {
    preview() {
      this.$router.push({
        name: "preview-char",
        params: { id: this.pId }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.r {
  width: 2.5rem;
}
.even-bg {
  background-color: #303048;
}
</style>

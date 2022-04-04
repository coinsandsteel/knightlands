<template>
  <div
    class="flex flex-item-center font-size-20 width-100 pointer"
    :class="[{ 'even-bg': (index + 1) % 2 == 0 }, { 'yellow-title': you }]"
    :style="{ height: `${height}px` }"
    @click="preview"
  >
    <span :class="rankIcon" class="r"></span>
    <span class="flex-1">#{{ rank }}</span>
    <Avatar :preview="false" :avatar="avatar" :mini="true"></Avatar>
    <span class="flex-2">{{ id }}</span>
    <span class="flex-2">
      <AprilGold :value="scoreComputed" />
    </span>
  </div>
</template>

<script>
import Avatar from "@/views/Character/Avatars/Avatar.vue";
import AprilGold from "@/views/April/AprilGold.vue";
import meta from "@/metadata/halloween/dungeon_meta";

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
  components: { Avatar, AprilGold },
  computed: {
    reward() {
      if (this.index >= meta.rewards.length) {
        return 0;
      }

      return meta.rewards[this.index];
    },
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

<template>
  <div
    class="flex flex-item-center font-size-20 width-100 pointer"
    :class="[{ 'even-bg': (index + 1) % 2 == 0 }, { 'yellow-title': you }]"
    :style="{ height: `${height}px` }"
    @click="preview"
  >
    <span :class="rankIcon" class="r"></span>
    <span class="flex-1">#{{ rank }}</span>
    <span class="icon-preview big"></span>
    <Avatar :preview="true" :avatar="avatar" :mini="true"></Avatar>
    <span class="flex-2">{{ id }}</span>
    <span class="flex-2">{{ scoreComputed }}</span>
    <div class="flex-3">
      <IconWithValue iconClass="icon-usdc big" v-if="reward > 0">
        {{ reward }}
      </IconWithValue>
    </div>
  </div>
</template>

<script>
import IconWithValue from "@/components/IconWithValue.vue";
import Avatar from "@/views/Character/Avatars/Avatar.vue";
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
  components: { Avatar, IconWithValue },
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

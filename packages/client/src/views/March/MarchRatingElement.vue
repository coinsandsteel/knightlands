<template>
  <div
    class="flex flex-item-center font-size-20 width-100 text-align-left padding-left-4"
    :class="[{ 'even-bg': (index + 1) % 2 == 0 }, { 'yellow-title': you }]"
    :style="{ height: `${height}px` }"
  >
    <span class="flex-1">#{{ index + 1 }}</span>
    <!-- <span class="icon-preview big"></span> -->
    <Avatar :preview="true" :avatar="record.avatar" :mini="true"></Avatar>
    <span class="flex-4">{{ record.name }}</span>
    <span class="flex-3">{{ scoreComputed }}</span>
  </div>
</template>
<script>
import Avatar from "@/views/Character/Avatars/Avatar.vue";

export default {
  components: { Avatar },
  props: ["index", "height", "record"],
  data() {
    return {};
  },
  computed: {
    you() {
      return this.index === 9;
    },
    scoreComputed() {
      const converted = Math.floor(this.record.score * 1000000) / 1000000;
      return isNaN(converted) ? this.record.score : converted;
    }
  }
};
</script>
<style scoped lang="less">
.r {
  width: 2.5rem;
}
.even-bg {
  background-color: #303048;
}
</style>

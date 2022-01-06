<template>
  <div class="screen-content">
    <AnimatedBackground></AnimatedBackground>
    <BaseMatching />
  </div>
</template>
<script>
import AnimatedBackground from "@/components/AnimatedBackground.vue";
import BaseMatching from "@/views/Lunar/BaseMatching.vue";
export default {
  components: {
    AnimatedBackground,
    BaseMatching
  },
  data() {
    return {};
  }
};
</script>
<style scoped lang="less"></style>

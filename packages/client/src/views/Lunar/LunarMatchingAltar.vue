<template>
  <div class="screen-content">
    <AnimatedBackground></AnimatedBackground>
    <BaseMatching />
  </div>
</template>
<script>
import AnimatedBackground from "@/components/AnimatedBackground.vue";
import BaseMatching from "@/views/Lunar/BaseMatching.vue";
import NetworkRequestErrorMixin from "@/components/NetworkRequestErrorMixin.vue";

export default {
  mixins: [NetworkRequestErrorMixin],
  components: {
    AnimatedBackground,
    BaseMatching
  },
  data() {
    return {
      selectedItems: []
    };
  },
  methods: {
    async exchangeHandler() {
      await this.performRequestNoCatch(
        this.$store.dispatch("lunar/exchange", this.selectedItems)
      );
    }
  }
};
</script>
<style scoped lang="less"></style>

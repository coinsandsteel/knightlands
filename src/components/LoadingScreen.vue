<template>
  <div v-show="loading" class="flex flex-column flex-center loading full-screen">
    <div class="bg-color" :style="opacityStyle"></div>
    <GridLoader color="#fde648" :size="15" margin="1px" />
    <span class="font-size-30">Loading</span>
  </div>
</template>

<script>
export default {
  props: {
    loading: Boolean,
    opacity: {
      type: Number,
      default: 0.4
    }
  },
  computed: {
    opacityStyle() {
      return `opacity: ${this.opacity};`;
    }
  }
};
</script>

<style lang="less" scoped>
.loading {
  z-index: 9999;

  & > span {
    z-index: 1;
  }
}

.bg-color {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: #210028;
}
</style>



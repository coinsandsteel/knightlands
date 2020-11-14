<template>
  <div v-if="active" class="marker marker-pos"></div>
</template>

<script>
export default {
  data: () => ({
    active: false
  })
};
</script>

<style lang="less" scoped>
.marker-pos {
  position: absolute;
  top: 0;
  right: 0rem;
  width: 3rem !important;
  height: 3rem !important;
}
</style>

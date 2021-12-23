<template>
  <div class="lvl-bg font-size-20">{{ level }}</div>
</template>

<script>
export default {
  props: ["level"]
};
</script>

<style lang="less" scoped>
.lvl-bg {
  border-image-source: url("../../assets/xmas/lvl_bg.png");
  border-image-slice: 24 fill;
  border-image-width: 8px;
  border-image-outset: 0px 0px 0px 0px;
  border-image-repeat: stretch stretch;
  padding: 1rem;
}
</style>

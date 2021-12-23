<template>
  <div class="lvl-bg font-size-18">{{ level }}</div>
</template>

<script>
export default {
  props: ["level"]
};
</script>

<style lang="less" scoped>
.lvl-bg {
  border-image-source: url("../../assets/xmas/lvl_bg.png");
  border-image-slice: 24 27 27 27 fill;
  border-image-width: 4px 5px 4px 5px;
  border-image-outset: 0px 0px 0px 0px;
  border-image-repeat: stretch stretch;
  padding: 0 0.5rem;
}
</style>

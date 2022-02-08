<template>
  <div class="march-card relative">
    <div class="absolute-stretch width-100 height-100">
      <div class="font-size-22">{{ card.unitClass }}</div>
      <div
        class="march-card-hp absolute-bottom-left flex flex-center line-height-0 font-size-25 font-weight-700"
      >
        3
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    card: Object
  },
  data() {
    return {};
  }
};
</script>
<style scoped lang="less">
.march-card-hp {
  background: #fff;
  border: 0.5rem solid #222;
  border-radius: 50%;
  width: 4rem;
  height: 4rem;
  color: #222;
}
</style>

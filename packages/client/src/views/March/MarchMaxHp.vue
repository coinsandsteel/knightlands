<template>
  <div class="march-max-hp font-size-20 flex flex-nowrap flex-items-center">
    <div class="march-max-hp-icons"></div>
    {{ value || 0 }}
  </div>
</template>
<script>
export default {
  props: ["value"]
};
</script>
<style scoped lang="less">
.march-max-hp-icons {
  display: inline-block;
  width: 20px;
  height: 20px;
  margin-right: 4px;
  background-image: url("/images/march/cards/max_hp.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
}
.march-max-hp--with-background {
  background: #214c6c;
  border-radius: 3px;
  padding: 0 1rem;
}
</style>

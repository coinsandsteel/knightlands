<template>
  <div class="april-hp font-size-20 flex flex-nowrap flex-items-center">
    <div class="april-hp-icons"></div>
    {{ value }}
    <slot />
  </div>
</template>
<script>
export default {
  props: ["value"]
};
</script>
<style scoped lang="less">
.april-hp-icons {
  display: inline-block;
  width: 20px;
  height: 20px;
  margin-right: 2px;
  background-image: url("/images/april/hp.png");
  background-size: 80%;
  background-position: center;
  background-repeat: no-repeat;
}
.april-hp--with-background {
  background: #214c6c;
  border-radius: 3px;
  padding: 0 1rem;
}
</style>

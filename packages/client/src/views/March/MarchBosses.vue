<template>
  <div class="march-bosses font-size-20 flex flex-nowrap flex-items-center">
    <div class="march-bosses-icons"></div>
    {{ bosses }}
  </div>
</template>
<script>
export default {
  props: ["value"],
  computed: {
    bosses() {
      if (typeof this.value === "number") {
        return this.value;
      }

      return 0;
    }
  }
};
</script>
<style scoped lang="less">
.march-bosses-icons {
  display: inline-block;
  width: 20px;
  height: 20px;
  margin-right: 4px;
  background-image: url("/images/march/icon_boss.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
}
.march-bosses--with-background {
  background: #214c6c;
  border-radius: 3px;
  padding: 0 1rem;
}
</style>

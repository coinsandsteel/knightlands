<template>
  <div class="april-points font-size-20 flex flex-nowrap flex-items-center">
    <div class="april-points-icons"></div>
    {{ points }}
    <slot />
  </div>
</template>
<script>
export default {
  props: ["value"],
  computed: {
    points() {
      if (typeof this.value === "number") {
        return this.value;
      }

      return this.$store.state.april.balance.points;
    }
  }
};
</script>
<style scoped lang="less">
.april-points-icons {
  display: inline-block;
  width: 20px;
  height: 20px;
  margin-right: 4px;
  background-image: url("/images/april/april_points.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
}
.april-points--with-background {
  background: #214c6c;
  border-radius: 3px;
  padding: 0 1rem;
}
</style>

<template>
  <div class="march-step font-size-20 flex flex-nowrap flex-items-center">
    <div class="march-step-icons"></div>
    {{ step }}
  </div>
</template>
<script>
export default {
  props: ["value"],
  data() {
    return {};
  },
  computed: {
    step() {
      if (typeof this.value === "number") {
        return this.value;
      }

      return 0;
    }
  }
};
</script>
<style scoped lang="less">
.march-step-icons {
  display: inline-block;
  width: 20px;
  height: 20px;
  margin-right: 4px;
  background-image: url("/images/march/icon_turns.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
}
.march-step--with-background {
  background: #214c6c;
  border-radius: 3px;
  padding: 0 1rem;
}
</style>

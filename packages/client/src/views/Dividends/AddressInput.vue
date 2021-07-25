<template>
  <div class="width-100 flex flex-center input-bg">
    <input
      class="input flex-11 font-size-22 white-font text-center"
      placeholder="0x"
      v-model="valueInput"
    />
  </div>
</template>

<script>
export default {
  props: ["value"],
  data: () => ({
    valueInput: 0
  }),
  watch: {
    value: {
      immediate: true,
      handler() {
        this.valueInput = this.value;
      }
    },
    valueInput() {
      this.$emit("input", this.valueInput);
    }
  }
};
</script>

<style lang="less" scoped>
@import "./style.less";
</style>

<template>
  <div
    class="battle-ability-select flex flex-center pointer"
    @click="close(123)"
  >
    <div class="font-size-22">
      abilities
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  methods: {
    close(result) {
      this.$emit("close", result);
    }
  }
};
</script>
<style scoped lang="scss">
.battle-ability-select {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 100%;
  background: rgba(#000, 0.5);
}
</style>

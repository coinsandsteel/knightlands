<template>
  <div class="font-size-20">Gold???: {{ gold }}</div>
</template>
<script>
export default {
  props: ["value"],
  data() {
    return {};
  },
  computed: {
    gold() {
      if (typeof this.value === "number") {
        return this.value;
      }

      return this.$store.state.march.balance.gold;
    }
  }
};
</script>
<style scoped lang="less"></style>

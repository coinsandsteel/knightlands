<template>
  <div class="font-size-20">Tickets???: {{ tickets }}</div>
</template>
<script>
export default {
  props: ["value"],
  data() {
    return {};
  },
  computed: {
    tickets() {
      if (typeof this.value === "number") {
        return this.value;
      }

      return this.$store.state.march.balance.tickets;
    }
  }
};
</script>
<style scoped lang="less"></style>

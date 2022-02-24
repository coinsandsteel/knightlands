<template>
  <div class="march-gold font-size-20 flex flex-nowrap flex-items-center">
    <div class="march-gold-icons"></div>
    {{ gold }}
  </div>
</template>
<script>
export default {
  props: ["value"],
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
<style scoped lang="less">
.march-gold-icons {
  display: inline-block;
  width: 20px;
  height: 20px;
  margin-right: 4px;
  background-image: url("/images/march/march_gold.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
}
.march-gold--with-background {
  background: #214c6c;
  border-radius: 3px;
  padding: 0 1rem;
}
</style>

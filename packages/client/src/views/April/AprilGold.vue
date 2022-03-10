<template>
  <div class="april-gold font-size-20 flex flex-nowrap flex-items-center">
    <div class="april-gold-icons"></div>
    {{ gold }}
    <slot />
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

      return this.$store.state.april.balance.gold;
    }
  }
};
</script>
<style scoped lang="less">
.april-gold-icons {
  display: inline-block;
  width: 20px;
  height: 20px;
  margin-right: 4px;
  background-image: url("/images/april/april_gold.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
}
.april-gold--with-background {
  background: #214c6c;
  border-radius: 3px;
  padding: 0 1rem;
}
</style>

<template>
  <div class="battle-coin font-size-20 flex flex-nowrap flex-items-center">
    <div
      class="battle-coin-icons"
      :class="{ 'battle-coin-icons--with-margin': hasMargin }"
    ></div>
    {{ coins }}
    <slot />
  </div>
</template>
<script>
export default {
  props: ["value", "hasMargin"],
  computed: {
    coins() {
      if (typeof this.value === "number") {
        return this.value;
      }

      return this.$store.state.battle.user.balance.coins || 0;
    }
  }
};
</script>
<style scoped lang="less">
.battle-coin-icons {
  display: inline-block;
  width: 20px;
  height: 20px;
  background-image: url("/images/battle/battle_coin.png");
  background-size: 80%;
  background-position: center;
  background-repeat: no-repeat;
}
.battle-coin-icons--with-margin {
  margin-right: 2px;
}
.battle-coin--with-background {
  background: #214c6c;
  border-radius: 3px;
  padding: 0 1rem;
}
</style>

<template>
  <div class="battle-coin font-size-20 flex flex-nowrap flex-items-center">
    <div class="battle-coin-icons"></div>
    {{ coins }}
    <slot />
  </div>
</template>
<script>
export default {
  props: ["value"],
  computed: {
    coins() {
      if (typeof this.value === "number") {
        return this.value;
      }

      return this.$store.state.battle.user.balance.coins;
    }
  }
};
</script>
<style scoped lang="less">
.battle-coin-icons {
  display: inline-block;
  width: 20px;
  height: 20px;
  margin-right: 4px;
  background-image: url("/images/battle/battle_coin.png");
  background-size: 80%;
  background-position: center;
  background-repeat: no-repeat;
}
.battle-coin--with-background {
  background: #214c6c;
  border-radius: 3px;
  padding: 0 1rem;
}
</style>

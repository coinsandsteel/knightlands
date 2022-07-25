<template>
  <div class="battle-crystal font-size-20 flex flex-nowrap flex-items-center">
    <div class="battle-crystal-icons"></div>
    {{ crystals }}
    <slot />
  </div>
</template>
<script>
export default {
  props: ["value"],
  computed: {
    crystals() {
      if (typeof this.value === "number") {
        return this.value;
      }

      return this.$store.state.battle.user.balance.crystals;
    }
  }
};
</script>
<style scoped lang="less">
.battle-crystal-icons {
  display: inline-block;
  width: 20px;
  height: 20px;
  margin-right: 2px;
  background-image: url("/images/battle/battle_crystal.png");
  background-size: 80%;
  background-position: center;
  background-repeat: no-repeat;
}
.battle-crystal--with-background {
  background: #214c6c;
  border-radius: 3px;
  padding: 0 1rem;
}
</style>

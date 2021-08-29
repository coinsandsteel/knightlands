<template>
  <keep-alive>
    <router-view v-if="armyLoaded"></router-view>
  </keep-alive>
</template>

<script>
export default {
  name: "raids",
  data: () => ({
    armyLoaded: false
  }),
  async mounted() {
    this.armyLoaded = await this.$game.army.load();
  }
};
</script>

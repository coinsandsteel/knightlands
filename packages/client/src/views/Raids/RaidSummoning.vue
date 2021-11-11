<template>
  <router-view v-if="armyLoaded"></router-view>
</template>

<script>
export default {
  name: "raid-summoning",
  data: () => ({
    armyLoaded: false
  }),
  async mounted() {
    this.armyLoaded = await this.$game.army.load();
  }
};
</script>

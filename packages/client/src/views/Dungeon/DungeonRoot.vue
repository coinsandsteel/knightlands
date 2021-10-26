<template>
  <keep-alive>
    <router-view v-if="loaded"></router-view>
  </keep-alive>
</template>

<script>
import { mapState } from 'vuex';

export default {
  async mounted() {
    this.$store.dispatch('dungeon/subscribe');
    await this.$store.dispatch('dungeon/load');
  },
  beforeDestroy() {
    this.$store.dispatch('dungeon/unsubscribe');
  },
  computed: {
    ...mapState({
      loaded: state => state.dungeon.loaded,
      combat: state => state.dungeon.combat
    })
  }
};
</script>

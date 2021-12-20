<template>
  <keep-alive>
    <router-view v-if="loaded"></router-view>
  </keep-alive>
</template>

<script>
import { mapState } from "vuex";

export default {
  async mounted() {
    this.$store.dispatch("xmas/subscribe");
    await this.$store.dispatch("xmas/load");
  },
  beforeDestroy() {
    this.$store.dispatch("xmas/unsubscribe");
  },
  computed: {
    ...mapState({
      loaded: state => state.xmas.loaded
    })
  }
};
</script>

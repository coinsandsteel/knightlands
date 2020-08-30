<template>
  <router-view></router-view>
</template>

<script>
import { Promised } from "vue-promised";
import LoadingScreen from "@/components/LoadingScreen.vue";

export default {
  components: { LoadingScreen, Promised },
  data: () => ({
    request: null
  }),
  async mounted() {
    // this.request = this.$game.army.load();
    // await this.request;
  }
};
</script>

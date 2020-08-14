<template>
  <Promised :promise="request" tag="div">
    <template v-slot:combined="{ isPending, isDelayOver, error, data }">
      <LoadingScreen :loading="isPending && isDelayOver"></LoadingScreen>

      <router-view v-if="data && !error"></router-view>
    </template>
  </Promised>
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
    this.request = this.$game.army.load();
    await this.request;
  }
};
</script>

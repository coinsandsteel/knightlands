<template>
  <Promised :promise="promise" tag="div">
    <template v-slot:combined="{ isPending, isDelayOver, data }">
      <LoadingScreen :loading="isPending && isDelayOver" />

      <slot name="fixed"></slot>
      <slot name="loaded" v-if="data"></slot>
      <slot name="error"></slot>
    </template>
  </Promised>
</template>

<script>
import { Promised } from "vue-promised";
import LoadingScreen from "@/components/LoadingScreen.vue";

export default {
  props: ["promise"],
  components: { Promised, LoadingScreen }
};
</script>

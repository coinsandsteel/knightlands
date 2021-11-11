<template>
  <Promised :promise="promise" tag="div">
    <template v-slot:combined="{ isPending, isDelayOver, error }">
      <LoadingScreen :loading="isPending && isDelayOver" />

      <slot name="fixed"></slot>
      <slot name="loaded"></slot>
      <slot name="error" v-if="error"></slot>
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

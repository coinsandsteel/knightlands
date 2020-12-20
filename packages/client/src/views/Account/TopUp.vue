<template>
  <div class="screen-content">
    <div class="screen-background"></div>
  </div>
</template>

<script>
import AppSection from "@/AppSection.vue";

export default {
  mixins: [AppSection],
  created() {
    this.title = "w-top-up";
  }
};
</script>

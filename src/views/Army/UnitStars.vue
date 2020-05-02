<template>
  <div class="flex">
    <span class="star active small" v-for="star in parseInt(computedStars)" :key="star"></span>
  </div>
</template>

<script>
export default {
  props: ["stars"],
  computed: {
    computedStars() {
      return this.stars > 5 ? this.stars - 5 : this.stars;
    }
  }
};
</script>



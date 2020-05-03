<template>
  <div class="flex flex-center flex-no-wrap">
    <span class="star active" :class="size" v-for="star in parseInt(computedStars)" :key="star"></span>
  </div>
</template>

<script>
export default {
  props: ["stars", "size"],
  computed: {
    computedStars() {
      return this.stars > 5 ? this.stars - 5 : this.stars;
    }
  }
};
</script>



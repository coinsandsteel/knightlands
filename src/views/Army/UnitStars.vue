<template>
  <div class="flex flex-center flex-no-wrap">
    <span class="star active" :class="size" v-for="star in parseInt(computedStars)" :key="star"></span>
  </div>
</template>

<script>
import anime from "animejs/lib/anime.es.js";

export default {
  props: ["stars", "size"],
  computed: {
    computedStars() {
      return this.stars > 5 ? this.stars - 5 : this.stars;
    }
  },
  methods: {
    async show(duration) {
      anime.remove(".star");
      anime.set(".star", { opacity: 0, scale: 0 });

      anime({
        targets: ".star",
        opacity: {
          value: [0, 1]
        },
        scale: {
          value: [0, 1]
        },
        duration: duration,
        delay: anime.stagger(100)
      });
    }
  }
};
</script>

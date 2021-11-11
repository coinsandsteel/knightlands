<template>
  <Loot class="inline-block root" :item="item" :interactible="false"></Loot>
</template>

<script>
import Loot from "@/components/Loot.vue";
import anime from "animejs/lib/anime.es.js";

export default {
  components: { Loot },
  props: ["item"],
  mounted() {
    this.$nextTick(() => {
      this.play();
    });
  },
  methods: {
    play() {
      let timeline = anime.timeline({
        targets: this.$el
      });

      anime.set(this.$el, {
        top: "105%",
        left: "50%",
        translateX: "-50%",
        translateY: "-50%",
        opacity: 1
      });

      timeline.add({
        delay: this.item.delay,
        easing: "easeOutQuint",
        duration: 600,
        top: "50%"
      });

      timeline.add({
        easing: "easeInSine",
        duration: 2500,
        top: "0%",
        opacity: 0
      });
    }
  }
};
</script>

<style lang="less" scoped>
.root {
  pointer-events: none;
  position: absolute;
  will-change: transform, opacity;
}
</style>

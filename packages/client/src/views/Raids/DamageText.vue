<template>
  <div class="font-size-5 root font-shadow inline-block">
    <slot></slot>
  </div>
</template>

<script>
import anime from "animejs/lib/anime.es.js";

const OffsetY = {
  min: 10,
  max: 30
};

const OffsetX = {
  min: -20,
  max: 20
};

export default {
  props: ["crit", "local"],
  mounted() {
    this.$nextTick(() => {
      if (this.local) {
        this.playLocal();
      } else {
        this.playRemote();
      }
    });
  },
  methods: {
    playRemote() {
      const fontSize = this.crit ? "4rem" : "3rem";
      const color = this.crit ? "#fdc64f" : "#fff";

      let timeline = anime.timeline({
        targets: this.$el
      });

      anime.set(this.$el, {
        color,
        top: "105%",
        right: "-5%",
        translateY: "-50%",
        opacity: 1
      });

      timeline.add({
        easing: "easeOutQuint",
        duration: 600,
        "font-size": fontSize,
        right: "5%",
        top: "50%"
      });

      timeline.add({
        easing: "easeInSine",
        duration: 2500,
        "font-size": `3rem`,
        top: "0%",
        opacity: 0
      });
    },
    playLocal() {
      const offsetY = OffsetY.min + Math.random() * (OffsetY.max - OffsetY.min);
      const offsetX = OffsetX.min + Math.random() * (OffsetX.max - OffsetX.min);
      const FontSize = this.crit ? 10 : 8;
      const color = this.crit ? "#fdc64f" : "#fff";
      const easing = this.crit ? "easeOutElastic" : "easeOutExpo";

      let timeline = anime.timeline({
        targets: this.$el
      });

      timeline.add({
        duration: 0
      });

      timeline.add({
        duration: 600,
        easing: easing,
        color: color,
        "font-size": `*=${FontSize}`,
        bottom: `+=${offsetY}%`,
        left: `+=${offsetX}%`,
        opacity: 1
      });

      timeline.add({
        duration: 1000,
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
  will-change: transform, opacity, font-size;
}
</style>

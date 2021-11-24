<template>
  <div class="font-size-5 root font-shadow inline-block">
    <slot></slot>
  </div>
</template>

<script>
import anime from "animejs/lib/anime.es.js";

const OffsetY = {
  min: -60,
  max: -80
};

const OffsetX = {
  min: -30,
  max: 10
};

export default {
  mounted() {
    this.$nextTick(() => {
      this.playLocal();
    });
  },
  methods: {
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
        top: `+=${offsetY}%`,
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
  top: 0;
  left: 50%;
  will-change: transform, opacity, font-size;
}
</style>

<template>
  <div ref="root" class="font-size-5 root font-outline digit-font">
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
  props: ["crit"],
  mounted() {
    this.$nextTick(() => {
      const offsetY = OffsetY.min + Math.random() * (OffsetY.max - OffsetY.min);
      const offsetX = OffsetX.min + Math.random() * (OffsetX.max - OffsetX.min);
      const FontSize = this.crit ? 15 : 8;
      const color = this.crit ? "#fdc64f" : "#fff";
      const easing = this.crit ? "easeOutElastic" : "easeOutExpo";

      let timeline = anime.timeline({
        targets: this.$refs.root
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
        opacity: 1
      });

      timeline.add({
        duration: 1000,
        opacity: 0
      });
    });
  }
};
</script>

<style lang="less" scoped>
.root {
  pointer-events: none;
  position: absolute;
  bottom: 60%;
  left: 0;
  right: 0;
  opacity: 0;
}
</style>

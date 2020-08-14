<template>
  <div ref="root" class="font-size-5 root font-outline digit-font">
    <slot></slot>
  </div>
</template>

<script>
import anime from "animejs/lib/anime.es.js";

const OffsetY = {
  min: 5,
  max: 10
};

const OffsetX = {
  min: -20,
  max: 20
};

export default {
  props: {
    crit: Boolean,
    fontSizeNormal: {
      type: Number,
      default: 8
    },
    fontSizeCrit: {
      type: Number,
      default: 15
    },
    critOffsetY: {
      type: Number,
      default: 15
    }
  },
  mounted() {
    this.$nextTick(() => {
      let offsetY = OffsetY.min + Math.random() * (OffsetY.max - OffsetY.min);

      if (this.crit) {
        offsetY += this.critOffsetY;
      }

      const offsetX = OffsetX.min + Math.random() * (OffsetX.max - OffsetX.min);
      const fontSize = this.crit ? this.fontSizeCrit : this.fontSizeNormal;
      const color = this.crit ? "#fdc64f" : "#fff";
      const easing = this.crit ? "easeOutElastic" : "easeOutExpo";

      let timeline = anime.timeline({
        targets: this.$refs.root
      });

      timeline.add({
        duration: 600,
        easing: easing,
        color: color,
        "font-size": `*=${fontSize}`,
        bottom: `+=${offsetY}%`,
        left: `${offsetX}%`,
        opacity: 1,
        delay: anime.stagger(100)
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
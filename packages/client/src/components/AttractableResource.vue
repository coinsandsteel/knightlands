<template>
  <IconWithValue
    :iconClass="icon"
    :value="`${sign}${value}`"
    valueClass="font-weight-900 font-outline"
    class="absolute animation-hint"
  >
    <slot></slot>
  </IconWithValue>
</template>

<script>
import IconWithValue from "@/components/IconWithValue.vue";
import anime from "animejs/lib/anime.es.js";

export default {
  props: ["resourceName", "value"],
  components: { IconWithValue },
  computed: {
    sign() {
      return this.value > 0 ? "+" : "-";
    },
    color() {
      let color = "#ff3e3e";
      switch (this.resourceName) {
        case "health":
          color = "#d8fc9a";
          break;

        case "energy":
          color = "#00d8f5";
          break;

        case "stamina":
          color = "#fbc722";
          break;

        case "exp":
          color = "#f5f5f7";
          break;

        case "softCurrency":
          color = "#f4d363";
          break;
      }
      return color;
    },
    icon() {
      let icon = "";
      switch (this.resourceName) {
        case "health":
          icon = "icon-health";
          break;

        case "energy":
          icon = "icon-energy";
          break;

        case "stamina":
          icon = "icon-stamina";
          break;

        case "exp":
          icon = "icon-exp";
          break;

        case "softCurrency":
          icon = "icon-gold";
          break;
      }
      return icon;
    }
  },
  methods: {
    async show() {
      let timeline = anime.timeline({
        targets: this.$el
      });

      anime.set(this.$el, {
        opacity: 0
      });

      timeline.add({
        duration: 400,
        easing: "easeOutCubic",
        color: this.color,
        "font-size": "4.2rem",
        // translateY: "+=1rem",
        opacity: 1
      });

      await timeline.finished;
    }
  }
};
</script>

<style scoped>
.animation-hint {
  will-change: transform, opacity, font-size;
}
</style>

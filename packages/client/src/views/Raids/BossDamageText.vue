<template>
  <div class="inline-block absolute font-weight-900 font-shadow">
    {{ damage }}
  </div>
</template>

<script>
import anime from "animejs/lib/anime.es.js";

export default {
  props: ["damage"],
  methods: {
    async show() {
      //   const FontSize = this.crit ? 15 : 8;
      //   const color = this.crit ? "#fdc64f" : "#fff";
      //   const easing = this.crit ? "easeOutElastic" : "easeOutExpo";

      let timeline = anime.timeline({
        targets: this.$el
      });

      anime.set(this.$el, {
        opacity: 0
      });

      timeline.add({
        duration: 250,
        easing: "easeOutElastic",
        color: "#ff3e3e",
        "font-size": `5rem`,
        // bottom: `+=${offsetY}%`,
        // left: `+=${offsetX}%`,
        opacity: 1
      });

      await timeline.finished;
    }
  }
};
</script>

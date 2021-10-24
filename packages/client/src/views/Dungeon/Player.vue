<template>
  <div class="dungeon-player" :style="style"></div>
</template>

<script>
import anime from "animejs/lib/anime.es.js";

export default {
  data: () => ({
    pos: {
      x: 0,
      y: 0
    }
  }),
  computed: {
    style() {
      return {
        left: this.pos.x + "px",
        top: this.pos.y + "px"
      };
    }
  },
  methods: {
    snapToPosition({ x, y }) {
      this.pos.x = x;
      this.pos.y = y;
    },
    async moveToPosition({ x, y }) {
      anime.remove(this.pos);

      const timeline = anime({
        targets: this.pos,
        x,
        y,
        duration: 1500,
        easing: "easeOutElastic(1, .6)"
      });

      await timeline.finished;
    }
  }
};
</script>

<style lang="less" scoped>
.dungeon-player {
  background-image: url("/images/halloween_assets/loot.png");
}
</style>

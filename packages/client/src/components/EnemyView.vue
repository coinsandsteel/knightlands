<template>
  <div
    class="enemy-view relative height-100 width-100 flex flex-center"
    :style="backgroundImage"
  >
    <div class="enemy-name">
      <span class="font-size-30 enemy-title-font font-outline capitalize">{{
        $t(name)
      }}</span>
    </div>
    <img ref="enemyView" :src="enemyImage" />
    <slot></slot>
  </div>
</template>

<script>
import anime from "animejs/lib/anime.es.js";

export default {
  props: ["name", "image", "background"],
  computed: {
    enemyImage() {
      return `/images/enemies/${this.image}.png`;
    },
    backgroundImage() {
      return {
        "background-image": `url(${this.background})`
      };
    }
  },
  methods: {
    onDamage(crit) {
      const enemyView = this.$refs.enemyView;
      anime.remove(enemyView);

      let timeline = anime.timeline({
        targets: enemyView
      });

      if (crit) {
        timeline.add({
          translateX: function(el, i) {
            return `-=${anime.random(-1, -2)}rem`;
          },
          translateY: function(el, i) {
            return `-=${anime.random(-1, 1)}rem`;
          },
          scale: 1.2 + Math.random() * 0.2,
          duration: 0,
          loop: 1
        });
      }

      timeline.add(
        {
          filter: "brightness(100)",
          duration: 0
        },
        0
      );

      timeline.add({
        translateX: 0,
        translateY: 0,
        scale: 1,
        filter: {
          value: "brightness(1)",
          easeing: "",
          duration: 100
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.enemy-view {
  width: 100%;
  min-height: 25vh;
  max-height: 40vh;
  justify-content: center;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;

  & img {
    max-width: 100%;
    max-height: 100%;
  }
}

.enemy-name {
  padding: 1rem;
  background-color: #0d00287d;
  border-radius: 2px;
  // position: absolute;
  // top: 0;
  // left: 50%;
  // transform: translateX(-50%);
}
</style>

<template>
  <div ref="root" class="card pixelated" v-on="$listeners" :class="{elevated: elevated}">
    <div class="card-inner" ref="inner">
      <div class="card-front">
        <img src="../../../assets/ui/card_front.png" />
        <div class="absolute-stretch flex flex-column flex-space-evenly">
          <span class="rarity-legendary font-size-25 font-outline">{{$t(name)}}</span>
          <span class="font-size-18 font-outline">{{value}}</span>
        </div>
      </div>
      <img class="card-back absolute-stretch" src="../../../assets/ui/card_back.png" />
    </div>
  </div>
</template>

<script>
import anime from "animejs/lib/anime.es.js";
import CardInfo from "./CardInfo.vue";

export default {
  mixins: [CardInfo],
  data: () => ({
    elevated: false
  }),
  methods: {
    async setFlipped(flipped, animated) {
      let rotation = "180deg";
      if (!flipped) {
        rotation = "0deg";
      }

      if (animated) {
        await anime({
          targets: this.$refs.inner,
          rotateY: rotation,
          duration: 800,
          easing: "easeInOutBack"
        }).finished;
      } else {
        anime.set(this.$refs.inner, {
          rotateY: rotation
        });
      }
    },
    reset() {
      this.elevated = false;
    },
    elevate() {
      this.elevated = true;
    },
    async choiceAnimation() {
      await this.setFlipped(true, true);
    }
  }
};
</script>

<style lang="less" scoped>
.card {
  width: 30%;
  perspective: 1000px;

  &.elevated {
    z-index: 100;
  }

  & .card-inner {
    position: relative;
    width: 100%;
    height: 100%;
    text-align: center;
    transform-style: preserve-3d;

    & img {
      z-index: -1;
      max-width: 100%;
      object-fit: contain;
    }
  }
}

.bg() {
  background-repeat: no-repeat;
  background-size: contain;
  backface-visibility: hidden;
}

.card-front {
  .bg();
  background-image: url("../../../assets/ui/card_front.png");
  transform: rotateY(180deg);
}

.card-back {
  .bg();
  background-image: url("../../../assets/ui/card_back.png");
}
</style>
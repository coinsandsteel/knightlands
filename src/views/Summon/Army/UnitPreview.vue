<template>
  <div v-bar>
    <div class="dummy-height" @click="show">
      <div class="height-100 flex flex-column flex-no-wrap">
        <div class="element-background" :class="element"></div>

        <div class="width-100 flex flex-center padding-2 height-45">
          <img class="unit-image" :src="$game.armyDB.getIcon(unit)" />
        </div>

        <Flipper
          class="unit-preview-title width-100 margin-bottom-2"
          :flipKey="flipId"
          :spring="{
            stiffness: 400,
            damping: 40
        }"
          :staggerConfig="{
            ability: {
                speed: 1
            }
        }"
        >
          <Flipped flipId="title" opacity translate>
            <span
              class="preview-title font-size-30 font-weight-900"
              :class="{'show': showAnimation}"
            >{{name}}</span>
          </Flipped>

          <Flipped flipId="flag" opacity translate>
            <Flag
              class="flag"
              :class="{'show': showAnimation}"
              :weaponType="weaponType"
              :element="element"
            ></Flag>
          </Flipped>
          <UnitStars ref="stars" class="stars" :stars="stars" size="big"></UnitStars>
        </Flipper>

        <Flipper
          :flipKey="flipId"
          :spring="{
            stiffness: 400,
            damping: 40
        }"
          class="full-flex font-size-22 preview-abilities relative"
        >
          <div class="bg absolute-stretch flex flex-column">
            <div class="pattern"></div>
            <div class="fade"></div>
          </div>

          <Flipped stagger="ability" :flipId="a.id.toString()" v-for="a in abilities" :key="a.id">
            <div class="ability-panel width-100" :class="{'show': showAnimation}">
              <span v-html="getAbilityDesc(a)"></span>
            </div>
          </Flipped>
        </Flipper>
      </div>
    </div>
  </div>
</template>

<script>
import UnitGetter from "../../Army/UnitGetterMixin.vue";
import UnitStars from "../../Army/UnitStars.vue";
import Flag from "../../Army/Flag.vue";
import anime from "animejs/lib/anime.es.js";
import { Flipper, Flipped } from "vue-flip-toolkit";

export default {
  mixins: [UnitGetter],
  props: ["unit"],
  components: { UnitStars, Flag, Flipped, Flipper },
  data: () => ({
    showAnimation: false,
    flipId: 0
  }),
  watch: {
    unit: {
      immediate: true,
      handler() {
        this.show();
      }
    }
  },
  methods: {
    show() {
      this.showAnimation = false;
      this.$nextTick(() => {
        this.animate();
      });
    },
    async animate() {
      this.showAnimation = true;
      this.flipId++;

      const fadeDuration = 500;

      this.$refs.stars.show(fadeDuration);

      let timeline = anime.timeline({
        duration: fadeDuration,
        easing: "easeOutCubic"
      });

      timeline.add({
        targets: ".unit-image",
        opacity: {
          value: [0, 1]
        },
        scale: {
          value: [0, 1],
          easing: "easeOutElastic(1, 0.8)"
        }
      });

      await timeline.finished;
    }
  }
};
</script>

<style lang="less" scoped>
.unit-image {
  max-width: 100%;
  max-height: 100%;
}

.unit-preview-title {
  display: grid;
  padding: 0 2rem 0 2rem;
  grid-template-columns: 4rem 1fr;
  grid-template-rows: 1fr 1fr;
  align-items: stretch;
  height: 10rem;
  position: relative;

  & .preview-title {
    text-transform: uppercase;
    text-align: start;
    position: absolute;
    right: -100%;
    opacity: 0;

    &.show {
      grid-row: 1;
      grid-column: 2;
      justify-self: start;
      opacity: 1;
      position: unset;
    }
  }

  & .flag {
    position: relative;
    top: -100%;
    opacity: 0;

    &.show {
      grid-row: ~"1/3";
      grid-column: 1;
      opacity: 1;
      position: unset;
    }
  }

  & .stars {
    grid-row: 2;
    grid-column: 2;
    justify-self: start;
  }
}

.ability-panel {
  background-color: #193f5fd4;
  text-align: start;
  padding: 1rem 3rem 1rem 3rem;
  margin-bottom: 1rem;
  position: absolute;
  bottom: -100%;
  left: 0;
  right: 0;
  opacity: 0;

  &.show {
    opacity: 1;
    position: relative;
    bottom: unset;
  }
}

.preview-abilities {
  padding-top: 1rem;

  & .bg {
    & .pattern {
      background-image: url("../../../assets/ui/bg_blue_pattern.png");
      background-repeat: repeat;
      background-size: 9rem;
      height: 20rem;
    }

    & .fade {
      background-image: url("../../../assets/ui/bg_blue_pattern_fade.png");
      background-repeat: repeat;
      background-size: 9rem;
      flex: 1;
    }
  }
}
</style>

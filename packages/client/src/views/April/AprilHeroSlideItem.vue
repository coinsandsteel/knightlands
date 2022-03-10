<template>
  <div v-if="hero" class="">
    <div
      class="hero-slider-item relative"
      :class="{ 'hero-slider-item---not-unlocked': !hero.unlocked }"
    >
      <div
        class="april-hero-element-background-color absolute"
        :class="`april-hero-element-background-color--${hero.heroClass}`"
      ></div>
      <div
        class="april-hero-element-background absolute"
        :class="`april-hero-element-background--${hero.petClass}`"
      ></div>
      <div
        class="hero-slider-item-hero-image absolute-center"
        :class="`april-hero-${hero.heroClass}-${hero.level}`"
      ></div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    hero: Object
  }
};
</script>
<style scoped lang="less">
.hero-slider-item {
  width: 180px;
  max-width: 80vw;
  height: 0;
  padding-bottom: 100%;
  // background-image: url("/images/march/pet_container.png");
  // background-size: 100% 100%;
  // background-repeat: no-repeat;
}
.hero-slider-item---not-unlocked {
  opacity: 0.3;
}
.hero-slider-item-level {
  background: #fff;
  border: 0.5rem solid #222;
  border-radius: 50%;
  width: 4rem;
  height: 4rem;
  color: #222;
}
.hero-slider-item-hero-image {
  width: 50%;
  padding-bottom: 50%;
  background-size: 100% 100%;
  background-position: center;
}
.hero-slider-item-hero-name {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translate(-50%, calc(-100% - 1rem));
}
.april-hero-element-background-color {
  background-color: #00a3ee;
  background-size: 100%;
  background-repeat: no-repeat;
  width: calc(100% - 6px);
  height: calc(100% - 6px);
  top: 3px;
  left: 3px;
}
.april-hero-element-background {
  background-size: 100%;
  background-repeat: no-repeat;
  width: 100%;
  height: 100%;
  top: 0px;
  left: 0px;
}
</style>

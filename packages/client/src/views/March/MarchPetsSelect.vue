<template>
  <div class="march-pets-grid">
    <span class="zone-nav flex flex-center" @click="goToPrev">
      <div class="nav-arrow left"></div>
    </span>

    <slider
      ref="slider"
      animation="fade"
      :touch="true"
      :control-btn="false"
      :indicators="false"
      :autoplay="false"
      height="100%"
      @change="changeHandler"
      v-model="sliderIndex"
    >
      <slider-item v-for="(pet, petIndex) in pets" :key="petIndex">
        <div class="pet-slide-item width-100 height-100 flex flex-center">
          <MarchPetSlideItem :pet="pet" />
        </div>
      </slider-item>
    </slider>

    <span class="zone-nav right flex flex-center" @click="goToNext">
      <div class="nav-arrow"></div>
    </span>
  </div>
</template>
<script>
import MarchPetSlideItem from "@/views/March/MarchPetSlideItem.vue";
export default {
  components: {
    MarchPetSlideItem
  },
  data() {
    return {
      sliderIndex: 0
    };
  },
  computed: {
    pets() {
      return [
        { id: 1, name: "Pet 1", discovered: true, level: 2 },
        { id: 2, name: "Pet 2", discovered: false },
        { id: 3, name: "Pet 3", discovered: false },
        { id: 4, name: "Pet 4", discovered: false },
        { id: 5, name: "Pet 5", discovered: false }
      ];
    }
  },
  methods: {
    goToNext() {
      this.sliderIndex = (this.sliderIndex + 1) % this.pets.length;
    },
    goToPrev() {
      this.sliderIndex =
        (this.sliderIndex - 1 < 0
          ? this.pets.length - 1
          : this.sliderIndex - 1) % this.pets.length;
    },
    changeHandler() {}
  }
};
</script>
<style scoped lang="less">
@import (reference) "../../style/common.less";
.march-pets-grid {
  display: grid;
  grid-template-columns: 5rem 1fr 5rem;
  grid-template-rows: 1fr;
  height: 25vh;
  justify-content: center;
}
.zone-nav {
  cursor: pointer;
  height: 100%;
  grid-column: 1;
  grid-row: 1;
  z-index: 100;

  &.right {
    grid-column: 3;
  }
}
</style>

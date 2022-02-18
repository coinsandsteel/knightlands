<template>
  <div class="march-pets-grid">
    <span
      class="zone-nav flex flex-justify-end flex-items-center"
      @click="goToPrev"
    >
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
      v-model="$store.state.march.selectedPetIndex"
    >
      <slider-item v-for="(pet, petIndex) in pets" :key="petIndex">
        <div class="pet-slide-item width-100 height-100 flex flex-center">
          <MarchPetSlideItem :pet="pet" />
        </div>
      </slider-item>
    </slider>

    <span
      class="zone-nav right flex flex-justify-start flex-items-center"
      @click="goToNext"
    >
      <div class="nav-arrow"></div>
    </span>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import MarchPetSlideItem from "@/views/March/MarchPetSlideItem.vue";
export default {
  components: {
    MarchPetSlideItem
  },
  data() {
    return {
      // sliderIndex: 0
    };
  },
  computed: {
    ...mapGetters("march", ["pets"])
  },
  methods: {
    goToNext() {
      this.$store.state.march.selectedPetIndex =
        (this.$store.state.march.selectedPetIndex + 1) % this.pets.length;
    },
    goToPrev() {
      this.$store.state.march.selectedPetIndex =
        (this.$store.state.march.selectedPetIndex - 1 < 0
          ? this.pets.length - 1
          : this.$store.state.march.selectedPetIndex - 1) % this.pets.length;
    },
    changeHandler() {}
  }
};
</script>
<style scoped lang="less">
@import (reference) "../../style/common.less";
.slider {
  width: 240px !important;
  height: 200px;
  min-height: 200px;
  max-width: 80vw;
}
.march-pets-grid {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  grid-template-rows: 1fr;
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

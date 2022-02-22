<template>
  <div v-if="pet" class="">
    <!-- <div class="_pet-slider-item-pet-name font-size-25">{{ pet.name }}</div> -->
    <div
      class="pet-slider-item pet-1 relative"
      :class="{ 'pet-slider-item---not-unlocked': !pet.unlocked }"
    >
      <!-- <img
        :src="
          pet.unlocked
            ? '/images/march/pet1.png'
            : '/images/march/mystery-pet.png'
        "
        draggable="false"
      /> -->

      <!-- <div class="pet-slider-item-pet-name font-size-25">{{ pet.name }}</div> -->
      <div
        class="pet-slider-item-pet-image absolute-center"
        :class="`march-pet-${pet.petClass}-${pet.level}`"
      ></div>
      <!-- <div
        v-if="pet.level"
        class="pet-slider-item-level absolute-top-right font-size-25 flex flex-center"
      >
        <div class="line-height-0 font-weight-700">
          {{ pet.level }}
        </div>
      </div> -->
    </div>
    <!-- <div class="_pet-slider-item-pet-name font-size-25">{{ pet.name }}</div> -->
  </div>
</template>
<script>
export default {
  props: {
    pet: Object
  },
  data() {
    return {};
  }
};
</script>
<style scoped lang="less">
.pet-slider-item {
  width: 180px;
  max-width: 80vw;
  height: 0;
  padding-bottom: 100%;
  background-image: url("/images/march/pet_container.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
}
.pet-slider-item---not-unlocked {
  opacity: 0.3;
}
.pet-slider-item-level {
  background: #fff;
  border: 0.5rem solid #222;
  border-radius: 50%;
  width: 4rem;
  height: 4rem;
  color: #222;
}
.pet-slider-item-pet-image {
  width: 50%;
  padding-bottom: 50%;
  background-size: 100% 100%;
  background-position: center;
}
.pet-slider-item-pet-name {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translate(-50%, calc(-100% - 1rem));
}
</style>

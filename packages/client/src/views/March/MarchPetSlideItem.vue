<template>
  <div v-if="pet" class="">
    <div
      class="pet-slider-item pet-1 relative"
      :class="{ 'pet-slider-item---not-unlocked': !pet.unlocked }"
    >
      <div
        class="march-pet-element-background-color absolute"
        :class="`march-pet-element-background-color--${pet.petClass}`"
      ></div>
      <div
        class="march-pet-element-background absolute"
        :class="`march-pet-element-background--${pet.petClass}`"
      ></div>
      <div
        class="pet-slider-item-pet-image absolute-center"
        :class="`march-pet-${pet.petClass}-${pet.level}`"
      ></div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    pet: Object
  }
};
</script>
<style scoped lang="less">
.pet-slider-item {
  width: 180px;
  max-width: 80vw;
  height: 0;
  padding-bottom: 100%;
  // background-image: url("/images/march/pet_container.png");
  // background-size: 100% 100%;
  // background-repeat: no-repeat;
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
.march-pet-element-background-color {
  background-color: #00a3ee;
  background-size: 100%;
  background-repeat: no-repeat;
  width: calc(100% - 6px);
  height: calc(100% - 6px);
  top: 3px;
  left: 3px;
}
.march-pet-element-background {
  background-size: 100%;
  background-repeat: no-repeat;
  width: 100%;
  height: 100%;
  top: 0px;
  left: 0px;
}
</style>

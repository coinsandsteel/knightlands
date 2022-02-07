<template>
  <div v-if="pet" class="height-100">
    <div class="pet-slider-item pet-1 relative">
      <img
        :src="
          pet.discovered
            ? '/images/march/pet1.png'
            : '/images/march/mystery-pet.png'
        "
      />
      <div
        v-if="pet.level"
        class="pet-slider-item-level absolute-top-right font-size-25 flex flex-center"
      >
        <div class="line-height-0 font-weight-700">
          {{ pet.level }}
        </div>
      </div>
    </div>
    <div class="font-size-25">{{ pet.name }}</div>
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
  height: calc(100% - 4rem);
}
.pet-slider-item-level {
  background: #fff;
  border: 0.5rem solid #222;
  border-radius: 50%;
  width: 4rem;
  height: 4rem;
  color: #222;
}
</style>

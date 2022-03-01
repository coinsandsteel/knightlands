<template>
  <div v-if="pet">
    <div class="font-size-22 font-weight-700 padding-bottom-1">
      <span class="pet-name">{{ pet.name }}</span>
      <span class="pet-level">lvl {{ pet.level }}</span>
      <span v-if="pet.level === 3" class="pet-level-max">(MAX)</span>
    </div>
    <div
      class="march-pet-element pointer relative"
      :class="[
        {
          'march-pet-element--not-unlocked': applyOpacity && !pet.unlocked
        },
        `march-pet-element--${pet.petClass}`
      ]"
      @click="petClickHandler"
    >
      <div
        class="march-pet-element-background-color absolute"
        :class="`march-pet-element-background-color--${pet.petClass}`"
      ></div>
      <div
        class="march-pet-element-background absolute"
        :class="`march-pet-element-background--${pet.petClass}`"
      ></div>
      <div class="absolute-stretch flex flex-center font-size-22">
        <div class="march-pet" :class="`march-${pet.key}`"></div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "MarchPetElement",
  props: {
    pet: Object,
    applyOpacity: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    async petClickHandler() {
      this.$emit("click");
    }
  }
};
</script>
<style scoped lang="less">
// .march-pet-element {
//   padding-bottom: 100%;
//   border: 1px solid transparent;
//   border-image-source: url("/images/march/pet_bg.png");
//   border-image-width: 14px;
//   border-image-slice: 30;
//   border-image-outset: 0;
//   border-image-repeat: round;
// }
// .march-pet-element-background {
//   background-size: 100%;
//   background-repeat: no-repeat;
//   background-color: #00a3ee;
//   width: calc(100% - 10px);
//   height: calc(100% - 10px);
//   top: 5px;
//   left: 5px;
// }
.march-pet-element {
  padding-bottom: 100%;
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
  // background-color: #00a3ee;
  // width: calc(100% - 6px);
  // height: calc(100% - 6px);
  // top: 3px;
  // left: 3px;
}
.march-pet-element--not-unlocked {
  opacity: 0.3;
}
.pet-level {
  display: inline-block;
  margin-left: 1rem;
  color: #fbe648;
}
.pet-level-max {
  display: inline-block;
  margin-left: 1rem;
  color: #00ec00;
}
.march-pet {
  width: 50%;
  padding-bottom: 50%;
  background-size: 100% 100%;
  background-position: center;
}
</style>

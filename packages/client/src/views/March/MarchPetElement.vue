<template>
  <div v-if="pet">
    <div class="font-size-22 font-weight-700 padding-bottom-1">
      <span class="pet-name">{{ pet.name }}</span>
      <span class="pet-level">lvl {{ pet.level }}</span>
      <span v-if="pet.level === 3" class="pet-level-max">(MAX)</span>
    </div>
    <div
      class="march-pet-element pointer relative"
      :class="{
        'march-pet-element--not-unlocked': applyOpacity && !pet.unlocked
      }"
      @click="petClickHandler"
    >
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
  data() {
    return {};
  },
  methods: {
    async petClickHandler() {
      this.$emit("click");
    }
  }
};
</script>
<style scoped lang="less">
.march-pet-element {
  padding-bottom: 100%;
  background-image: url("/images/march/pet_container.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
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

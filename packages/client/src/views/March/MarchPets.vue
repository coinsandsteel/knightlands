<template>
  <div class="screen-content">
    <div class="march-pets height-100 overflow-auto">
      <MarchPetElement v-for="pet in pets" :key="pet" />
    </div>
  </div>
</template>
<script>
import MarchPetElement from "@/views/March/MarchPetElement.vue";
export default {
  components: {
    MarchPetElement
  },
  data() {
    return {};
  },
  computed: {
    pets() {
      return new Array(15).fill(0).map((item, index) => index);
    }
  }
};
</script>
<style scoped lang="less">
.march-pets {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 1rem;
}
</style>

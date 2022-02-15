<template>
  <div class="march-pet-element pointer relative" @click="petClickHandler">
    <div class="absolute-stretch flex flex-center font-size-22">Pet</div>
  </div>
</template>
<script>
import { create } from "vue-modal-dialogs";
import MarchPetDetails from "@/views/March/MarchPetDetails.vue";

export default {
  props: ["pet"],
  data() {
    return {};
  },
  methods: {
    async petClickHandler() {
      const showPetDetailsDialog = create(MarchPetDetails);
      await showPetDetailsDialog();
    }
  }
};
</script>
<style scoped lang="less">
.march-pet-element {
  padding-bottom: 100%;
  background: #aaa;
}
</style>

<template>
  <div class="screen-content">
    <div class="march-pets height-100 overflow-auto">
      <MarchPetElement
        v-for="pet in allPets"
        :key="pet.key"
        :pet="pet"
        @click="petClickHandler(pet)"
      />
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { create } from "vue-modal-dialogs";
import MarchPetDetails from "@/views/March/MarchPetDetails.vue";
import MarchPetElement from "@/views/March/MarchPetElement.vue";
export default {
  components: {
    MarchPetElement
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters("march", ["allPets"])
    // pets() {
    //   return new Array(15).fill(0).map((item, index) => index);
    // }
  },
  methods: {
    async petClickHandler(pet) {
      const showPetDetailsDialog = create(MarchPetDetails, "pet");
      await showPetDetailsDialog(pet);
    }
  }
};
</script>
<style scoped lang="less">
.march-pets {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 3rem;
  padding: 3rem;
  align-items: end;
}
</style>

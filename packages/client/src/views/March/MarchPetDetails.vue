<template>
  <UserDialog title="Pet details???" emitClose @close="close">
    <template v-slot:content>
      <div>
        <div
          class="march-pet-element-wrapper flex flex-no-wrap flex-justify-center padding-top-2 padding-bottom-3"
        >
          <MarchPetElement
            class="march-pet-element-details"
            :pet="pet"
            :applyOpacity="false"
          />
        </div>
        <MarchPetAbilities :pet="pet" class=" margin-top-4 margin-bottom-2" />
      </div>
    </template>
  </UserDialog>
</template>
<script>
import * as march from "@/../../knightlands-shared/march";
import MarchPetElement from "@/views/March/MarchPetElement.vue";
import MarchPetAbilities from "@/views/March/MarchPetAbilities.vue";

export default {
  components: { MarchPetElement, MarchPetAbilities },
  props: {
    pet: Object
  },
  computed: {
    abilities() {
      if (!this.pet) {
        return;
      }

      if (this.pet.petClass === 1 && this.pet.level === 1) {
        return [];
      }

      return march.PET_ABILITIES[this.pet.petClass - 1].slice(
        0,
        this.pet.level
      );
    }
  },
  methods: {
    close() {
      this.$close("dialog result");
    }
  }
};
</script>
<style scoped lang="less">
.march-pet-element-wrapper {
  background: #1b3d60;
  margin-left: -1px;
  margin-right: -1px;
}
.march-pet-element-details {
  width: 200px;
  max-width: 40%;
}
</style>

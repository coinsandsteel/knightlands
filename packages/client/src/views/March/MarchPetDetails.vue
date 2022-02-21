<template>
  <UserDialog title="Pet details???" emitClose @close="close">
    <template v-slot:content>
      <!-- <div class="flex flex-row flex-no-wrap">
        <div>
          <img class="pet-image" src="/images/march/pet1.png" />
        </div>
        <div class="flex flex-center font-size-22 text-align-left">
          <div>
            <div>Name</div>
            <div class="flex flex-row flex-nowrap">
              <div>Ability:</div>
              <div>description</div>
            </div>
            <div class="flex flex-row flex-nowrap">
              <div>Ability:</div>
              <div>description</div>
            </div>
            <div class="flex flex-row flex-nowrap">
              <div>Ability:</div>
              <div>description</div>
            </div>
          </div>
        </div>
      </div> -->
      <div>
        <div
          class="march-pet-element-wrapper flex flex-no-wrap flex-justify-center padding-top-2 padding-bottom-2"
        >
          <MarchPetElement
            class="march-pet-element-details"
            :pet="pet"
            :applyOpacity="false"
          />
        </div>
        <div>
          abilities
        </div>
      </div>
    </template>
  </UserDialog>
</template>
<script>
import MarchPetElement from "@/views/March/MarchPetElement.vue";
export default {
  components: { MarchPetElement },
  props: ["pet"],
  data() {
    return {};
  },
  methods: {
    close() {
      this.$close("dialog result 123");
    }
  }
};
</script>
<style scoped lang="less">
// .pet-image {
//   max-width: 100%;
//   max-height: 40vh;
// }
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

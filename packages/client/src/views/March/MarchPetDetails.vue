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
import MarchPetElement from "@/views/March/MarchPetElement.vue";
import MarchPetAbilities from "@/views/March/MarchPetAbilities.vue";

const PET_ABILITIES = [
  [
    {},
    { name: "Health booster value +1???" },
    { name: "Armor booster value +1???" }
  ],
  [
    { name: "Bow damage +1???" },
    { name: "When 2 bows are stacked, +2 damage???" },
    { name: "Bomb explosion does not damage???" }
  ],
  [
    { name: "Max HP +1???" },
    { name: "50% chance to block 1 damage???" },
    { name: "Extra life at the start of the session???" }
  ],
  [
    { name: "Gold +1 from gold card???" },
    { name: "+20% extra gold per session???" },
    { name: "Chest opens without mini-game???" }
  ],
  [
    { name: "All barrels have only good content???" },
    {
      name:
        "HP can exceed the maximum, but if the maximum is exceeded, then the booster does not have an effect???"
    },
    { name: "Turns armor into ball lightning???" }
  ]
];

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

      return PET_ABILITIES[this.pet.petClass - 1].slice(0, this.pet.level);
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

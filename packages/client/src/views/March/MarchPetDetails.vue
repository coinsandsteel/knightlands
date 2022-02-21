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
          class="march-pet-element-wrapper flex flex-no-wrap flex-justify-center padding-top-2 padding-bottom-3"
        >
          <MarchPetElement
            class="march-pet-element-details"
            :pet="pet"
            :applyOpacity="false"
          />
        </div>
        <div
          class="march-pet-abilities-container font-size-22 margin-top-4 margin-bottom-2"
        >
          <div class="march-pet-abilities">
            <template v-for="(ability, abilityIndex) in abilities">
              <div
                v-if="ability.name"
                :key="'icon-' + ability.name"
                class="march-pet-ability-wrapper relative"
                :class="{
                  'march-pet-ability-wrapper--locked': abilityIndex >= pet.level
                }"
              >
                <div
                  :class="[
                    `march-pet-ability march-pet-ability-${
                      pet.petClass
                    }-${abilityIndex + 1}`
                  ]"
                ></div>
              </div>
              <div
                v-if="ability.name"
                :key="'name-' + ability.name"
                class=" text-align-left"
              >
                {{
                  abilityIndex >= pet.level
                    ? "Level up to unlock this ability???"
                    : ability.name
                }}
              </div>
            </template>
          </div>
        </div>
      </div>
    </template>
  </UserDialog>
</template>
<script>
import * as march from "@/../../knightlands-shared/march";
import MarchPetElement from "@/views/March/MarchPetElement.vue";
export default {
  components: { MarchPetElement },
  props: ["pet"],
  data() {
    return {};
  },
  computed: {
    abilities() {
      if (!this.pet) {
        return;
      }

      return march.PET_ABILITIES[this.pet.petClass - 1].slice(
        0,
        3 || this.pet.level
      );
    }
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
.march-pet-abilities-container {
}
.march-pet-abilities {
  display: inline-grid;
  grid-template-columns: 4rem 1fr;
  grid-gap: 2rem;
  max-width: 240px;
  align-items: center;
}
.march-pet-ability-wrapper {
  width: 4rem;
  height: 4rem;
}
.march-pet-ability {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-size: 100%;
  background-repeat: none;
  position: relative;
}
.march-pet-ability-wrapper--locked {
  .march-pet-ability {
    opacity: 0.5;
  }
  &::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    width: 2rem;
    height: 2rem;
    transform: translate(-50%, -50%);
    background-image: url("/images/march/icon_locked.png");
    background-size: 100%;
    background-repeat: none;
  }
}
</style>

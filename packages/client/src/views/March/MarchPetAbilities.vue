<template>
  <div class="march-pet-abilities-container font-size-22">
    <!-- no ability -->
    <div
      v-if="shouldShowNoAbility && !(abilities && abilities.length > 0)"
      class="text-center"
    >
      {{ $t("pet-has-no-ability") }}
    </div>
    <div class="march-pet-abilities">
      <!-- abilities -->
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
              ? $t("level-up-to-unlock-this-ability")
              : $t(ability.name)
          }}
        </div>
      </template>
    </div>
  </div>
</template>
<script>
import * as march from "@/../../knightlands-shared/march";
export default {
  props: {
    pet: Object,
    shouldShowNoAbility: {
      type: Boolean,
      default: true
    }
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
  }
};
</script>
<style scoped lang="less">
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
</style>

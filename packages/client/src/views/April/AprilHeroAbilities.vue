<template>
  <div class="april-hero-abilities-container font-size-22">
    <!-- no ability -->
    <div
      v-if="shouldShowNoAbility && !(abilities && abilities.length > 0)"
      class="text-center"
    >
      {{ $t("hero-has-no-ability") }}
    </div>
    <div class="april-hero-abilities">
      <!-- abilities -->
      <template v-for="(ability, abilityIndex) in abilities">
        <div
          v-if="ability.name"
          :key="'icon-' + ability.name"
          class="april-hero-ability-wrapper relative"
        >
          <div
            :class="[
              `april-hero-ability april-hero-ability-${
                hero.heroClass
              }-${abilityIndex + 1}`
            ]"
          ></div>
        </div>
        <div
          v-if="ability.name"
          :key="'name-' + ability.name"
          class=" text-align-left"
        >
          {{ $t(ability.name) }}
        </div>
      </template>
    </div>
  </div>
</template>
<script>
import * as april from "@/../../knightlands-shared/april";
export default {
  props: {
    hero: Object,
    shouldShowNoAbility: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    abilities() {
      if (!this.hero) {
        return;
      }

      return april.HERO_ABILITIES[this.hero.heroClass - 1].slice(
        0,
        this.hero.level
      );
    }
  }
};
</script>
<style scoped lang="less">
.april-hero-abilities {
  display: inline-grid;
  grid-template-columns: 4rem 1fr;
  grid-gap: 2rem;
  max-width: 240px;
  align-items: center;
}
.april-hero-ability-wrapper {
  width: 4rem;
  height: 4rem;
}
.april-hero-ability {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-size: 100%;
  background-repeat: none;
  position: relative;
}
</style>

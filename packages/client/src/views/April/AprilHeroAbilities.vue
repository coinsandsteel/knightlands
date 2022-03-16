<template>
  <div class="april-hero-abilities-container font-size-22">
    <div class="april-hero-abilities width-100">
      <!-- abilities -->
      <template v-for="ability in abilities">
        <!-- <div
          v-if="ability"
          :key="'icon-' + ability"
          class="april-hero-ability-wrapper relative"
        >
          <div
            :class="[
              `april-hero-ability april-hero-ability-${
                hero.heroClass
              }-${abilityIndex + 1}`
            ]"
          ></div>
        </div> -->
        <div
          v-if="ability"
          :key="'name-' + ability"
          class=" text-align-left width-100 text-align-center"
        >
          {{ $t(ability) }}
        </div>
      </template>
    </div>
  </div>
</template>
<script>
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

      return [this.hero.ability];
    }
  }
};
</script>
<style scoped lang="less">
.april-hero-abilities {
  display: inline-grid;
  grid-template-columns: 1fr;
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

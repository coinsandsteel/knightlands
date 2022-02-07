<template>
  <div class="screen-content">
    <!-- <div class="full-flex dummy-height width-100">
      <div
        class="width-100 height-100 dummy-height flex flex-column flex-no-wrap"
      >
        <MarchMainMenu />
      </div>
    </div> -->
    <MarchPetsSelect
      v-if="currentStep === PET_SELECT_STEP"
      @next="nextHandler"
      @back="backHandler"
    />
    <MarchBoosterSelect
      v-if="currentStep === BOOSTER_SELECT_STEP"
      @next="nextHandler"
      @back="backHandler"
    />
    <portal v-if="isActive" to="footer" :slim="true">
      <div class="width-100 flex flex-items-start">
        <BackButton class="back-button" @click="backHandler"></BackButton>
      </div>
    </portal>
  </div>
</template>
<script>
import AppSection from "@/AppSection.vue";
import MarchPetsSelect from "@/views/March/MarchPetsSelect.vue";
import MarchBoosterSelect from "@/views/March/MarchBoosterSelect.vue";
import BackButton from "@/views/Common/BackButton.vue";
const PET_SELECT_STEP = "PET_SELECT_STEP";
const BOOSTER_SELECT_STEP = "BOOSTER_SELECT_STEP";
const PLAY_STEP = "PLAY_STEP";
export default {
  mixins: [AppSection],
  components: { MarchPetsSelect, MarchBoosterSelect, BackButton },
  data() {
    return {
      PET_SELECT_STEP,
      BOOSTER_SELECT_STEP,
      PLAY_STEP,
      currentStep: PET_SELECT_STEP
    };
  },
  methods: {
    backHandler() {
      if (this.currentStep === BOOSTER_SELECT_STEP) {
        this.currentStep = PET_SELECT_STEP;
      }
    },
    nextHandler() {
      if (this.currentStep === PET_SELECT_STEP) {
        this.currentStep = BOOSTER_SELECT_STEP;
      }
    }
  }
};
</script>

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
    <MarchPlayField
      v-if="currentStep === PLAY_FIELD_STEP"
      @next="nextHandler"
      @back="backHandler"
    />
    <MarchPlaySummary
      v-if="currentStep === PLAY_SUMMARY_STEP"
      @next="nextHandler"
      @back="backHandler"
    />
    <portal
      v-if="isActive && currentStep === BOOSTER_SELECT_STEP"
      to="footer"
      :slim="true"
    >
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
import MarchPlayField from "@/views/March/MarchPlayField.vue";
import MarchPlaySummary from "@/views/March/MarchPlaySummary.vue";
import BackButton from "@/views/Common/BackButton.vue";
const PET_SELECT_STEP = 1;
const BOOSTER_SELECT_STEP = 2;
const PLAY_FIELD_STEP = 3;
const PLAY_SUMMARY_STEP = 4;
export default {
  mixins: [AppSection],
  components: {
    MarchPetsSelect,
    MarchBoosterSelect,
    BackButton,
    MarchPlayField,
    MarchPlaySummary
  },
  data() {
    return {
      PET_SELECT_STEP,
      BOOSTER_SELECT_STEP,
      PLAY_FIELD_STEP,
      PLAY_SUMMARY_STEP,
      currentStep: PLAY_SUMMARY_STEP
    };
  },
  methods: {
    backHandler() {
      if (this.currentStep === BOOSTER_SELECT_STEP) {
        --this.currentStep;
      }
    },
    nextHandler() {
      if (this.currentStep === PLAY_SUMMARY_STEP) {
        this.currentStep = PET_SELECT_STEP;
        return;
      }
      ++this.currentStep;
    }
  }
};
</script>

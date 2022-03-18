<template>
  <div class="screen-content overflow-auto" v-if="loaded">
    <AprilHeroSelect
      v-if="currentStep === HERO_SELECT_STEP"
      @next="showPlayFieldStep(true)"
    />
    <!-- <AprilBoosterSelect
      v-if="currentStep === BOOSTER_SELECT_STEP"
      @next="nextHandler"
      @back="backHandler"
    /> -->
    <AprilPlayField
      v-if="currentStep === PLAY_FIELD_STEP"
      @exit="showHeroSelectStep"
    />
    <AprilPlayRound
      v-if="currentStep === PLAY_ROUND_STEP"
      @next="showPlayFieldStep(false)"
      @exit="showHeroSelectStep"
    />
    <portal
      v-if="isActive && currentStep === HERO_SELECT_STEP"
      to="footer"
      :slim="true"
    >
      <div class="width-100 flex flex-items-start">
        <!-- <BackButton
          v-if="currentStep === BOOSTER_SELECT_STEP"
          class="back-button"
          @click="backHandler"
        ></BackButton> -->
        <div class="flex-full"></div>
        <div v-if="currentStep === HERO_SELECT_STEP">
          <CustomButton
            type="green"
            class="inline-block margin-right-2 margin-top-1"
            @click="goToShop"
          >
            Purchase gold
          </CustomButton>
        </div>
      </div>
    </portal>
  </div>
</template>
<script>
import * as april from "@/../../knightlands-shared/april";
import { mapState, mapGetters } from "vuex";
import { create } from "vue-modal-dialogs";
import AppSection from "@/AppSection.vue";
import AprilHeroSelect from "@/views/April/AprilHeroSelect.vue";
// import AprilBoosterSelect from "@/views/April/AprilBoosterSelect.vue";
import AprilPlayField from "@/views/April/AprilPlayField.vue";
import AprilPlayRound from "@/views/April/AprilPlayRound.vue";
import AprilPlaySummary from "@/views/April/AprilPlaySummary.vue";
// import BackButton from "@/views/Common/BackButton.vue";
import NetworkRequestErrorMixin from "@/components/NetworkRequestErrorMixin.vue";

const HERO_SELECT_STEP = 1;
// const BOOSTER_SELECT_STEP = 2;
const PLAY_FIELD_STEP = 2;
const PLAY_ROUND_STEP = 3;

export default {
  mixins: [AppSection, NetworkRequestErrorMixin],
  components: {
    AprilHeroSelect,
    // AprilBoosterSelect,
    // BackButton,
    AprilPlayField,
    AprilPlayRound
  },
  data() {
    return {
      HERO_SELECT_STEP,
      // BOOSTER_SELECT_STEP,
      PLAY_FIELD_STEP,
      PLAY_ROUND_STEP,
      // @todo
      // currentStep: HERO_SELECT_STEP
      currentStep: HERO_SELECT_STEP
    };
  },
  computed: {
    ...mapState("april", ["loaded", "sessionResult", "level"]),
    ...mapGetters("april", ["selectedHero"])
  },
  watch: {
    sessionResult(value) {
      if (!value) {
        return;
      }

      if (value === april.SESSION_RESULT_FAIL || this.level > 8) {
        this.showSummary();
        return;
      }

      this.showStartNewLevelStep();
    }
  },
  methods: {
    async testAction(action) {
      await this.performRequestNoCatch(
        this.$store.dispatch("april/testAction", action)
      );
    },
    backHandler() {
      // if (this.currentStep === BOOSTER_SELECT_STEP) {
      //   --this.currentStep;
      // }
    },
    // nextHandler(skipSummary) {
    //   if (this.currentStep === PLAY_FIELD_STEP) {
    //     // if (skipSummary === true) {
    //     //   this.currentStep = HERO_SELECT_STEP;
    //     //   return;
    //     // }
    //     // this.showSummary();
    //     return;
    //   }
    //   ++this.currentStep;

    //   if (this.currentStep === PLAY_FIELD_STEP) {
    //     this.$store.dispatch("april/restart", {
    //       heroClass: this.selectedHero.heroClass
    //     });
    //   }
    // },
    async showSummary() {
      const showDialog = create(AprilPlaySummary);
      const result = await showDialog();
      // this.currentStep = PET_SELECT_STEP;
      console.log("result", result);
      if (!(result && result.resurrection)) {
        this.showHeroSelectStep();
      }
    },
    showHeroSelectStep() {
      this.currentStep = HERO_SELECT_STEP;
    },
    showPlayFieldStep(shouldRestart = true) {
      this.currentStep = PLAY_FIELD_STEP;
      if (shouldRestart) {
        this.$store.dispatch("april/restart", {
          heroClass: this.selectedHero.heroClass
        });
      }
    },
    showStartNewLevelStep() {
      this.currentStep = PLAY_ROUND_STEP;
    },
    goToShop() {
      this.$router.push({ name: "april-shop" });
    }
  }
};
</script>

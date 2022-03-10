<template>
  <div class="screen-content overflow-auto" v-if="loaded">
    <AprilHeroSelect
      v-if="currentStep === HERO_SELECT_STEP"
      @next="nextHandler"
      @back="backHandler"
    />
    <AprilBoosterSelect
      v-if="currentStep === BOOSTER_SELECT_STEP"
      @next="nextHandler"
      @back="backHandler"
    />
    <AprilPlayField
      v-if="currentStep === PLAY_FIELD_STEP"
      @next="nextHandler"
      @back="backHandler"
    />
    <portal
      v-if="
        isActive &&
          (currentStep === BOOSTER_SELECT_STEP ||
            currentStep === HERO_SELECT_STEP)
      "
      to="footer"
      :slim="true"
    >
      <div class="width-100 flex flex-items-start">
        <BackButton
          v-if="currentStep === BOOSTER_SELECT_STEP"
          class="back-button"
          @click="backHandler"
        ></BackButton>
      </div>
    </portal>
  </div>
</template>
<script>
import { mapState } from "vuex";
// import { create } from "vue-modal-dialogs";
import AppSection from "@/AppSection.vue";
import AprilHeroSelect from "@/views/April/AprilHeroSelect.vue";
import AprilBoosterSelect from "@/views/April/AprilBoosterSelect.vue";
import AprilPlayField from "@/views/April/AprilPlayField.vue";
import BackButton from "@/views/Common/BackButton.vue";
import NetworkRequestErrorMixin from "@/components/NetworkRequestErrorMixin.vue";

const HERO_SELECT_STEP = 1;
const BOOSTER_SELECT_STEP = 2;
const PLAY_FIELD_STEP = 3;
const PLAY_ROUND_STEP = 4;

export default {
  mixins: [AppSection, NetworkRequestErrorMixin],
  components: {
    AprilHeroSelect,
    AprilBoosterSelect,
    BackButton,
    AprilPlayField
  },
  data() {
    return {
      HERO_SELECT_STEP,
      BOOSTER_SELECT_STEP,
      PLAY_FIELD_STEP,
      PLAY_ROUND_STEP,
      // @todo
      // currentStep: HERO_SELECT_STEP
      currentStep: HERO_SELECT_STEP
    };
  },
  computed: {
    ...mapState({
      loaded: state => state.april.loaded
    })
  },
  methods: {
    async testAction(action) {
      await this.performRequestNoCatch(
        this.$store.dispatch("april/testAction", action)
      );
    },
    backHandler() {
      if (this.currentStep === BOOSTER_SELECT_STEP) {
        --this.currentStep;
      }
    },
    nextHandler(skipSummary) {
      if (this.currentStep === PLAY_FIELD_STEP) {
        if (skipSummary === true) {
          this.currentStep = HERO_SELECT_STEP;
          return;
        }
        this.showSummary();
        return;
      }
      ++this.currentStep;
    },
    async showSummary() {
      // const showDialog = create(MarchPlaySummary);
      // await showDialog("gold");
      // this.currentStep = PET_SELECT_STEP;
    },
    goToShop() {
      this.$router.push({ name: "april-shop" });
    }
  }
};
</script>

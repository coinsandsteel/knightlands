<template>
  <div class="screen-content" v-if="loaded">
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
    <!-- <MarchPlaySummary
      v-if="currentStep === PLAY_SUMMARY_STEP"
      @next="nextHandler"
      @back="backHandler"
    /> -->
    <portal
      v-if="
        isActive &&
          (currentStep === BOOSTER_SELECT_STEP ||
            currentStep === PET_SELECT_STEP)
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
        <div class="flex-full"></div>
        <div
          v-if="
            currentStep === PET_SELECT_STEP ||
              currentStep === BOOSTER_SELECT_STEP
          "
        >
          <CustomButton
            type="yellow"
            class="inline-block margin-right-2 margin-top-1"
            @click="testAction('resetDailyRewards')"
          >
            Reset rewards
          </CustomButton>
          <CustomButton
            type="yellow"
            class="inline-block margin-right-2 margin-top-1"
            @click="testAction('plus1Day')"
          >
            +1 day
          </CustomButton>
          <CustomButton
            type="blue"
            class="inline-block margin-right-2 margin-top-1"
            @click="testAction('addTicket')"
          >
            Add ticket
          </CustomButton>
          <CustomButton
            type="green"
            class="inline-block margin-right-2 margin-top-1"
            @click="goToShop"
          >
            Purchase gold
          </CustomButton>
          <CustomButton
            type="blue"
            class="inline-block margin-right-2 margin-top-1"
            @click="goToRewards"
          >
            Rewards
          </CustomButton>
        </div>
      </div>
    </portal>
  </div>
</template>
<script>
import { mapState } from "vuex";
import { create } from "vue-modal-dialogs";
import AppSection from "@/AppSection.vue";
import MarchPetsSelect from "@/views/March/MarchPetsSelect.vue";
import MarchBoosterSelect from "@/views/March/MarchBoosterSelect.vue";
import MarchPlayField from "@/views/March/MarchPlayField.vue";
import MarchPlaySummary from "@/views/March/MarchPlaySummary.vue";
import BackButton from "@/views/Common/BackButton.vue";
import NetworkRequestErrorMixin from "@/components/NetworkRequestErrorMixin.vue";

const PET_SELECT_STEP = 1;
const BOOSTER_SELECT_STEP = 2;
const PLAY_FIELD_STEP = 3;
// const PLAY_SUMMARY_STEP = 4;

export default {
  mixins: [AppSection, NetworkRequestErrorMixin],
  components: {
    MarchPetsSelect,
    MarchBoosterSelect,
    BackButton,
    MarchPlayField
    // MarchPlaySummary
  },
  data() {
    return {
      PET_SELECT_STEP,
      BOOSTER_SELECT_STEP,
      PLAY_FIELD_STEP,
      // PLAY_SUMMARY_STEP,
      currentStep: PET_SELECT_STEP
    };
  },
  computed: {
    ...mapState({
      loaded: state => state.march.loaded
    })
  },
  methods: {
    async testAction(action) {
      await this.performRequestNoCatch(
        this.$store.dispatch("march/testAction", action)
      );
    },
    backHandler() {
      if (this.currentStep === BOOSTER_SELECT_STEP) {
        --this.currentStep;
      }
    },
    nextHandler() {
      // if (this.currentStep === PLAY_SUMMARY_STEP) {
      //   this.currentStep = PET_SELECT_STEP;
      //   return;
      // }
      if (this.currentStep === PLAY_FIELD_STEP) {
        this.showSummary();
        return;
      }
      ++this.currentStep;
    },
    async showSummary() {
      const showDialog = create(MarchPlaySummary);
      await showDialog("gold");
      this.currentStep = PET_SELECT_STEP;
    },
    goToShop() {
      this.$router.push({ name: "march-shop" });
    },
    goToRewards() {
      this.$router.push({ name: "march-rewards" });
    }
  }
};
</script>

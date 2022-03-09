<template>
  <div class="screen-content overflow-auto" v-if="loaded">
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
            v-if="false"
            type="yellow"
            class="inline-block margin-right-2 margin-top-1"
            @click="testAction('resetDailyRewards')"
          >
            Reset rewards
          </CustomButton>
          <CustomButton
            v-if="false"
            type="yellow"
            class="inline-block margin-right-2 margin-top-1"
            @click="testAction('plus1Day')"
          >
            +1 day
          </CustomButton>
          <CustomButton
            v-if="false"
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
            v-if="false"
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

export default {
  mixins: [AppSection, NetworkRequestErrorMixin],
  components: {
    MarchPetsSelect,
    MarchBoosterSelect,
    BackButton,
    MarchPlayField
  },
  data() {
    return {
      PET_SELECT_STEP,
      BOOSTER_SELECT_STEP,
      PLAY_FIELD_STEP,
      currentStep: PET_SELECT_STEP
    };
  },
  created() {
    this.$store.$app.$on("redirect-to-playfield", this.goToPlayfield);
  },
  destroyed() {
    this.$store.$app.$off("redirect-to-playfield");
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
    nextHandler(skipSummary) {
      if (this.currentStep === PLAY_FIELD_STEP) {
        if (skipSummary === true) {
          this.currentStep = PET_SELECT_STEP;
          this.$store.commit("march/clearCards");
          return;
        }
        this.showSummary();
        return;
      }
      ++this.currentStep;
    },
    async showSummary() {
      const showDialog = create(MarchPlaySummary);
      await showDialog("gold");
      this.$store.commit("march/clearCards");
      this.currentStep = PET_SELECT_STEP;
    },
    goToPlayfield() {
      this.currentStep = PLAY_FIELD_STEP;
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

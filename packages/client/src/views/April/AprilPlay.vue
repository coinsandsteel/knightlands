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
      @exit="playFieldExitHandler"
    />
    <AprilPlayRound
      v-if="currentStep === PLAY_ROUND_STEP"
      @next="aprilPlayRoundNextHandler"
      @exit="showHeroSelectStep"
    />
    <AprilPlaySummary
      v-if="isSummaryModalVisible"
      @closed="summaryClosedHandler"
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
          <template v-if="true">
            <CustomButton
              type="blue"
              class="inline-block margin-right-2 margin-top-1"
              @click="testAction('addTicket')"
            >
              addTicket
            </CustomButton>
            <CustomButton
              type="blue"
              class="inline-block margin-right-2 margin-top-1"
              @click="testAction('resetDailyRewards')"
            >
              resetDailyRewards
            </CustomButton>
            <CustomButton
              type="blue"
              class="inline-block margin-right-2 margin-top-1"
              @click="testAction('plus1Day')"
            >
              plus1Day
            </CustomButton>
            <CustomButton
              type="blue"
              class="inline-block margin-right-2 margin-top-1"
              @click="testAction('addGold')"
            >
              addGold
            </CustomButton>
            <CustomButton
              type="blue"
              class="inline-block margin-right-2 margin-top-1"
              @click="testAction('resetCharacters')"
            >
              resetCharacters
            </CustomButton>
          </template>
          <template v-if="isHourRewardVisible">
            <CustomButton
              v-if="canCollectHourReward"
              type="green"
              class="inline-block margin-right-2 margin-top-1"
              @click="collect1TicketHandler"
            >
              {{ $t("collect-free-ticket") }}
            </CustomButton>
            <div class="inline-block font-size-22" v-else>
              {{ freeTicketTimeLeft }}
            </div>
          </template>
          <CustomButton
            type="yellow"
            class="inline-block margin-right-2 margin-top-1"
            @click="goToShop"
          >
            {{ $t("shop") }}
          </CustomButton>
        </div>
      </div>
    </portal>
  </div>
</template>
<script>
import * as april from "@/../../knightlands-shared/april";
import { mapState, mapGetters } from "vuex";
// import { create } from "vue-modal-dialogs";
import Timer from "@/timer.js";
import AppSection from "@/AppSection.vue";
import AprilHeroSelect from "@/views/April/AprilHeroSelect.vue";
// import AprilBoosterSelect from "@/views/April/AprilBoosterSelect.vue";
import AprilPlayField from "@/views/April/AprilPlayField.vue";
import AprilPlayRound from "@/views/April/AprilPlayRound.vue";
import AprilPlaySummary from "@/views/April/AprilPlaySummary.vue";
// import BackButton from "@/views/Common/BackButton.vue";
import NetworkRequestErrorMixin from "@/components/NetworkRequestErrorMixin.vue";
import { sleep } from "@/helpers/utils";

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
    AprilPlayRound,
    AprilPlaySummary
  },
  data() {
    return {
      hourRewardTimer: new Timer(true),
      HERO_SELECT_STEP,
      // BOOSTER_SELECT_STEP,
      PLAY_FIELD_STEP,
      PLAY_ROUND_STEP,
      currentStep: HERO_SELECT_STEP,
      isSummaryModalVisible: false,
      shouldExitGame: false
    };
  },
  computed: {
    ...mapState("april", ["loaded", "sessionResult", "level", "playground"]),
    ...mapGetters("april", ["selectedHero", "hourReward"]),
    hourRewardLeft() {
      return this.hourReward ? this.hourReward.left || 0 : 0;
    },
    isHourRewardVisible() {
      return (
        this.hourRewardLeft > 0 &&
        typeof this.hourReward.nextRewardAvailable === "number"
      );
    },
    canCollectHourReward() {
      return this.isHourRewardVisible && this.hourRewardTimer.timeLeft <= 0;
    },
    freeTicketTimeLeft() {
      if (!this.hourRewardTimer) {
        return "";
      }
      // return this.$t("free-ticket-in", { time: "1:00:00" });
      return this.$t("free-ticket-in", { time: this.hourRewardTimer.value });
    }
  },
  watch: {
    async sessionResult(value) {
      this.sessionResultHandler(value);
    },
    hourRewardLeft() {
      this.updateHourRewardTimerValue();
    },
    loaded(value) {
      if (!value) {
        return;
      }
      this.loadedHandler();
    }
  },

  mounted() {
    this.updateHourRewardTimerValue();
    this.loadedHandler();
  },
  methods: {
    async testAction(action) {
      await this.performRequestNoCatch(
        this.$store.dispatch("april/testAction", action)
      );
    },
    async sessionResultHandler(value) {
      if (!value || !(this.currentStep === PLAY_FIELD_STEP)) {
        return;
      }

      if (value === april.SESSION_RESULT_FAIL || this.level > 8) {
        this.$store.commit("april/setIsDisabled", true);
        await sleep(1000);
        this.showSummary();
        return;
      }

      this.$store.commit("april/setIsDisabled", true);
      await sleep(600);
      this.showStartNewLevelStep();
    },
    loadedHandler() {
      if (!this.loaded) {
        return;
      }
      if (
        this.playground &&
        this.playground.units &&
        this.playground.units.length > 0
      ) {
        this.showPlayFieldStep(false);
        this.sessionResultHandler(this.sessionResult);
      }
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
    //   ++this.currentStep;F

    //   if (this.currentStep === PLAY_FIELD_STEP) {
    //     this.$store.dispatch("april/restart", {
    //       heroClass: this.selectedHero.heroClass
    //     });
    //   }
    // },
    async showSummary() {
      // const showDialog = create(AprilPlaySummary);
      // const result = await showDialog();
      // if (!(result && result.resurrection)) {
      //   this.showHeroSelectStep();
      // }
      this.isSummaryModalVisible = true;
    },
    summaryClosedHandler(result) {
      this.isSummaryModalVisible = false;
      if (!(result && result.isResurrection)) {
        if (this.shouldExitGame) {
          this.$store.dispatch("april/exit");
        }
        this.shouldExitGame = false;
        this.showHeroSelectStep();
      }
    },
    resetCards() {
      this.$store.commit("april/updateState", { cards: [] });
    },
    showHeroSelectStep() {
      this.currentStep = HERO_SELECT_STEP;
    },
    showPlayFieldStep(shouldRestart = true) {
      if (shouldRestart) {
        this.resetCards();
      }
      this.currentStep = PLAY_FIELD_STEP;
      this.$store.commit("april/setIsDisabled", false);
      if (shouldRestart) {
        this.$store.dispatch("april/restart", {
          heroClass: this.selectedHero.heroClass
        });
      }
    },
    aprilPlayRoundNextHandler() {
      this.resetCards();
      this.showPlayFieldStep(false);
    },
    showStartNewLevelStep() {
      this.currentStep = PLAY_ROUND_STEP;
    },
    goToShop() {
      this.$router.push({ name: "april-shop" });
    },
    collect1TicketHandler() {
      this.$store.dispatch("april/claimReward", {
        type: april.REWARD_TYPE_HOUR
      });
    },
    updateHourRewardTimerValue() {
      if (!(this.hourReward && this.hourRewardLeft > 0)) {
        return;
      }

      this.hourRewardTimer.timeLeft = Math.max(
        0,
        (this.hourReward.nextRewardAvailable || 0) - this.$game.nowSec
      );
      this.hourRewardTimer.update();
    },
    playFieldExitHandler() {
      this.shouldExitGame = true;
      this.showSummary();
    }
  }
};
</script>

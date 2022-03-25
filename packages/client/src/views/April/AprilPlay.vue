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
            {{ $t("purchase-gold") }}
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
    AprilPlayRound
  },
  data() {
    return {
      hourRewardTimer: new Timer(true),
      HERO_SELECT_STEP,
      // BOOSTER_SELECT_STEP,
      PLAY_FIELD_STEP,
      PLAY_ROUND_STEP,
      currentStep: HERO_SELECT_STEP
    };
  },
  computed: {
    ...mapState("april", ["loaded", "sessionResult", "level"]),
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
    hourRewardLeft() {
      this.updateHourRewardTimerValue();
    }
  },

  mounted() {
    this.updateHourRewardTimerValue();
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
    }
  }
};
</script>

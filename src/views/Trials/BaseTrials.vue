<template>
  <div>
    <keep-alive exclude="trial-cards">
      <Cards v-if="showCards"></Cards>
      <template v-else>
        <slot
          name="trial"
          :state="state"
          :id="trialId"
          :trialIndex="trialIndex"
          :mountCallback="addBackButtonListener"
          :engage="engageFight"
          v-if="trialId!==null"
        ></slot>
        <slot name="list" :state="state" :openTrial="openTrial" :trialType="trialType" v-else></slot>
      </template>
    </keep-alive>
  </div>
</template>

<script>
import AppSection from "@/AppSection";
import CustomButton from "@/components/Button.vue";
import TrialFooter from "./TrialFooter.vue";
import Cards from "./Cards/Cards.vue";

export default {
  mixins: [AppSection],
  props: ["titleStr", "trialType"],
  components: { Cards },
  data: () => ({
    request: null,
    state: null,
    trialId: null,
    trialIndex: 0,
    showCards: false
  }),
  activated() {
    this.title = this.titleStr;
    this.fetchRemoteState();

    this.addFooter(TrialFooter, {
      trialType: this.trialType,
      state: this.state,
      openCards: this.openCards.bind(this)
    });
  },
  watch: {
    "state.currentFight": {
      handler() {
        if (this.state.currentFight) {
          // open current fight right away
          this.trialId = this.state.currentFight.trialId;
        }
      }
    }
  },
  methods: {
    async engageFight(trialId, stageId, fightIndex) {
      this.request = this.$game.engageTrialFight(
        this.trialType,
        trialId,
        stageId,
        fightIndex
      );
    },
    addBackButtonListener(callback) {
      this.backButtonListener = callback;
    },
    handleBackButton() {
      if (this.showCards) {
        this.showCards = false;
        return true;
      }

      if (this.trialId !== null && this.backButtonListener()) {
        return true;
      }

      if (this.trialId !== null) {
        this.trialId = null;
        return true;
      }

      return false;
    },
    async fetchRemoteState() {
      this.state = this.$game.getTrialState(this.trialType);
    },
    openCards() {
      this.showCards = true;
    },
    openTrial(trialId, trialIndex) {
      this.trialId = trialId;
      this.trialIndex = trialIndex;
    }
  }
};
</script>
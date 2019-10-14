<template>
  <div>
    <keep-alive>
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
    </keep-alive>
  </div>
</template>

<script>
import AppSection from "@/AppSection";
import CustomButton from "@/components/Button.vue";
import TrialFooter from "./TrialFooter.vue";

export default {
  mixins: [AppSection],
  props: ["titleStr", "trialType"],
  data: () => ({
    request: null,
    state: null,
    trialId: null,
    trialIndex: 0
  }),
  activated() {
    this.title = this.titleStr;
    this.fetchRemoteState();
  },
  watch: {
    state() {
      this.removeFooter();
      this.addFooter(TrialFooter, {
        trialType: this.trialType,
        state: this.state
      });
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

      const response = await this.request;
      if (response) {
        this.state = response;
      }
    },
    addBackButtonListener(callback) {
      this.backButtonListener = callback;
    },
    handleBackButton() {
      if (this.trialId !== null && this.backButtonListener()) {
        return true;
      } else if (this.trialId !== null) {
        this.trialId = null;
        return true;
      }

      return false;
    },
    async fetchRemoteState() {
      this.request = this.$game.fetchTrialState(this.trialType);
      this.state = await this.request;

      if (this.state.currentFight) {
        // open current fight right away
        this.trialId = this.state.currentFight.trialId;
      }
    },
    openCards() {},
    openTrial(trialId, trialIndex) {
      this.trialId = trialId;
      this.trialIndex = trialIndex;
    }
  }
};
</script>
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
    <portal to="footer" :slim="true" v-if="isActive">
      <TrialFooter
        :trialType="trialType"
        :state="state"
        @open="openCards"
        @purchaseAttempts="purchaseAttempts"
      ></TrialFooter>
    </portal>
  </div>
</template>

<script>
import AppSection from "@/AppSection";
import CustomButton from "@/components/Button.vue";
import TrialFooter from "./TrialFooter.vue";
import Cards from "./Cards/Cards.vue";
import Errors from "@/../knightlands-shared/errors";
import PromptMixin from "@/components/PromptMixin.vue";

import PurchaseAttempts from "./PurchaseAttempts.vue";
import { create } from "vue-modal-dialogs";

const ShowPurchaseAttempts = create(PurchaseAttempts);

export default {
  mixins: [AppSection, PromptMixin],
  props: ["titleStr", "trialType"],
  components: { Cards, TrialFooter },
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
  },
  deactivated() {
    this.showCards = false;
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
    async purchaseAttempts() {
      const reponse = await ShowPurchaseAttempts();
    },
    async engageFight(trialId, stageId, fightIndex, callback) {
      this.request = this.$game.engageTrialFight(
        this.trialType,
        trialId,
        stageId,
        fightIndex
      );

      try {
        await this.request;
      } catch (exc) {
        if (exc.includes(Errors.TrialNoAttempts)) {
          this.showPrompt("prompt-snap-title", "trials-no-keys", [
            { type: "green", title: "Ok", response: true }
          ]);
        }
      }
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
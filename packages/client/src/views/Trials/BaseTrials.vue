<template>
  <div class="height-100">
    <div class="screen-background"></div>
    <keep-alive>
      <Cards v-if="showCards"></Cards>
      <template>
        <slot
          v-if="trialId !== null"
          name="trial"
          :id="trialId"
          :trialIndex="trialIndex"
          :mountCallback="addBackButtonListener"
          :engage="engageFight"
        ></slot>
        <slot
          v-show="trialId === null || trialId === undefined"
          name="list"
          :openTrial="openTrial"
          :trialType="trialType"
        ></slot>
      </template>
    </keep-alive>
    <portal to="footer" :slim="true" v-if="isActive && !showCards">
      <TrialFooter
        :trialType="trialType"
        @open="openCards"
        @purchaseAttempts="purchaseAttempts"
      ></TrialFooter>
    </portal>
  </div>
</template>

<script>
import AppSection from "@/AppSection.vue";
import TrialFooter from "./TrialFooter.vue";
import Cards from "./Cards/Cards.vue";
import Errors from "@/../../knightlands-shared/errors";
import PromptMixin from "@/components/PromptMixin.vue";
import NetworkRequestErrorMixin from "@/components/NetworkRequestErrorMixin.vue";

import PurchaseAttempts from "./PurchaseAttempts.vue";
import { create } from "vue-modal-dialogs";

const ShowPurchaseAttempts = create(PurchaseAttempts);

export default {
  mixins: [AppSection, PromptMixin, NetworkRequestErrorMixin],
  props: ["titleStr", "trialType"],
  components: { Cards, TrialFooter },
  data: () => ({
    state: null,
    request: null,
    trialId: null,
    trialIndex: 0,
    showCards: false
  }),
  activated() {
    this.state = this.$game.getTrialState(this.trialType);
    this.title = this.titleStr;
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
      await ShowPurchaseAttempts({
        trialType: this.trialType,
        canPurchase: !this.state.purchased
      });
    },
    async engageFight(trialId, stageId, fightIndex) {
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
          const response = await this.showPrompt(
            "prompt-snap-title",
            "trials-no-keys",
            [
              { type: "grey", title: "Ok", response: 1 },
              { type: "green", title: "btn-p-more", response: 2 }
            ]
          );

          if (response === 2) {
            this.purchaseAttempts();
          }
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

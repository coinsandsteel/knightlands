<template>
  <div class="flex flex-column flex-start relative">
    <boss-view v-if="raid" :raidTemplateId="raid"></boss-view>

    <StripedPanel contentClasses="flex-center">
      <span class="font-size-20 title margin-bottom-3">Select Difficulty</span>

      <StripedContent classes="width-100" stripeHeight="10rem" contentClasses="width-100">
        <difficulty-selector :stages="availableDifficulties" v-model="selectedStage"></difficulty-selector>
      </StripedContent>

      <div class="margin-top-3" v-if="$game.load">
        <span class="font-size-20 title margin-bottom">Required Essences</span>
        <div class="flex flex-center margin-top-1">
          <crafting-ingridient
            v-for="(essence) in requiredEssences"
            :key="essence.itemId"
            :ingridient="essence"
          />
        </div>
      </div>

      <div class="margin-top-2 font-size-20 flex flex-center">
        <span>Summoning Fee:</span>
        <price-tag :iap="iap" :overridePrice="awaitedPrice"></price-tag>
      </div>

      <div class="margin-top-2 flex flex-column flex-center">
        <LoadingIndicator v-if="pending" >
          <div class="font-size-20">{{$t("waiting-for-tx-confirmation")}}</div>
        </LoadingIndicator>

        <LoadingIndicator v-else-if="waitingForPayment">
          <div class="font-size-20">{{$t("waiting-for-payment")}}</div>
        </LoadingIndicator>

        <custom-button
          v-if="!pending"
          type="yellow"
          :disabled="!canSummon"
          @click="confirmSummon"
        >Summon</custom-button>
      </div>
    </StripedPanel>
  </div>
</template>

<script>
import AppSection from "@/AppSection";
import RaidsMeta from "@/raids_meta";
import UiConstants from "@/ui_constants";
import CraftingIngridient from "@/components/CraftingIngridient.vue";
import CustomButton from "@/components/Button.vue";
import PriceTag from "@/components/PriceTag.vue";
import Prompt from "@/components/Prompt.vue";
import { create as CreateDialog } from "vue-modal-dialogs";
import PaymentStatus from "@/../knightlands-shared/payment_status";
import Events from "@/../knightlands-shared/events";
import BossView from "./BossView.vue";
import StripedPanel from "@/components/StripedPanel.vue";
import StripedContent from "@/components/StripedContent.vue";
import LoadingIndicator from "@/components/LoadingIndicator.vue"

const ShowPrompt = CreateDialog(Prompt, ...Prompt.props);

import DifficultySelector from "@/components/DifficultySelector.vue";

export default {
  name: "raid-summon",
  mixins: [AppSection],
  props: {
    raid: String
  },
  components: {
    CraftingIngridient,
    CustomButton,
    PriceTag,
    BossView,
    DifficultySelector,
    StripedPanel,
    StripedContent,
    LoadingIndicator
  },
  created() {
    this.title = "Summon Raid";
    this.listener = this.fetchSummonStatus.bind(this);
    this.$game.on(Events.RaidSummonStatus, this.listener);
  },
  destroyed() {
    this.$game.off(Events.RaidSummonStatus, this.listener);
  },
  mounted() {
    this.fetchSummonStatus();
  },
  activated() {
    this.fetchSummonStatus();
  },
  data() {
    return {
      listener: undefined,
      selectedStage: 0,
      statusFetchInProcess: {},
      selectedStageStatus: {}
    };
  },
  watch: {
    selectedStage() {
      this.fetchSummonStatus();
    }
  },
  computed: {
    pending() {
      return (
        (this.selectedStageStatus[this.selectedStage] || {}).status ===
        PaymentStatus.Pending
      );
    },
    waitingForPayment() {
      return (
        (this.selectedStageStatus[this.selectedStage] || {}).status ===
        PaymentStatus.WaitingForTx
      );
    },
    awaitedPrice() {
      if (!this.waitingForPayment) {
        return null;
      }

      return this.selectedStageStatus[this.selectedStage].price;
    },
    meta() {
      return RaidsMeta[this.raid];
    },
    name() {
      return (this.meta || {}).name;
    },
    iap() {
      if (!this.meta) return "";
      return this.meta.stages[this.selectedStage].iap;
    },
    enemyImage() {
      if (!this.meta) return "";
      return `background-image: url("${UiConstants.enemyImage(
        this.meta.icon
      )}");`;
    },
    availableDifficulties() {
      return this.meta ? this.meta.stages.map((_, stage) => stage) : [];
    },
    requiredEssences() {
      if (!this.meta) {
        return [];
      }

      let stage = this.selectedStage;
      return this.$game.crafting.getRecipeIngridients(
        this.meta.stages[stage].summonRecipe
      );
    },
    canSummon() {
      if (!this.meta) {
        return false;
      }

      let stage = this.selectedStage;
      return this.$game.crafting.hasEnoughResourcesForRecipe(
        this.meta.stages[stage].summonRecipe
      );
    }
  },
  methods: {
    async fetchSummonStatus() {
      if (this.statusFetchInProcess[this.selectedStage]) {
        return;
      }

      this.statusFetchInProcess[this.selectedStage] = true;

      let status = await this.$game.fetchRaidSummonStatus(
        this.raid,
        this.selectedStage
      );
      this.$set(this.selectedStageStatus, this.selectedStage, status);

      this.statusFetchInProcess[this.selectedStage] = false;
    },
    async confirmSummon() {
      // summon was already requested and server waits for transaction object
      if (this.waitingForPayment) {
        const { iap, paymentId, price, signature } = this.selectedStageStatus[
          this.selectedStage
        ];

        await this.$game.purchaseIAP(iap, paymentId, price, signature);

        return;
      }

      let result = await ShowPrompt(
        `Are you sure?`,
        `Selected difficulty: ${UiConstants.stageNames[this.selectedStage]}`,
        [
          { type: "green", title: "Ok", response: true },
          { type: "red", title: "Cancel", response: false }
        ]
      );

      if (result === true) {
        let { signature, price, iap, paymentId } = await this.$game.summonRaid(
          this.raid,
          this.selectedStage
        );

        await this.fetchSummonStatus();

        try {
          await this.$game.purchaseIAP(iap, paymentId, price, signature);
          await this.fetchSummonStatus();
        } catch (exc) {
          console.log("Payment failed with exception", exc);
        }
      }
    }
  }
};
</script>

<style lang="less" scoped>
.raid-summon-title {
  position: absolute;
  top: 0;
}
</style>



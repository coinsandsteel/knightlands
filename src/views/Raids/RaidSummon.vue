<template>
  <div class="flex flex-column flex-center raid-summon-content">
    <div
      class="font-size-30 enemy-title-font raid-summon-title font-outline font-weight-700"
    >{{name}}</div>
    <div class="pixelated raid-summon-boss-image" :style="enemyImage"></div>

    <div class="flex flex-column flex-center margin-top-3">
      <span class="font-size-25">Select Difficulty</span>
      <div class="flex flex-center margin-top-small">
        <div class="stage-selector" v-for="stage in availableDifficulties" :key="stage">
          <input
            :id="`stage${stage}`"
            type="radio"
            name="stage"
            :value="stage"
            ref="stages"
            v-model="selectedStage"
          />
          <label :for="`stage${stage}`" :class="`stage${stage}`"></label>
        </div>
      </div>
    </div>

    <div class="margin-top-2">
      <span class="font-size-25">Required Essences</span>
      <div class="flex flex-center margin-top-small">
        <crafting-ingridient
          v-for="(essence) in requiredEssences"
          :key="essence.itemId"
          :ingridient="essence"
        />
      </div>
    </div>

    <div class="margin-top-2 font-size-25">
      <span>Summoning Fee:</span>
      <price-tag :iap="iap" :overridePrice="awaitedPrice"></price-tag>
    </div>

    <div class="margin-top-2 flex flex-column flex-center">
      <div v-if="pending" class="flex flex-center">
        <div class="font-size-20">Waiting for payment confirmation.</div>
        <GridLoader color="#fde648" :size="15" margin="1px" />
      </div>
      <div v-else-if="waitingForPayment" class="flex flex-center">
        <div class="font-size-20">Waiting for payment...</div>
        <GridLoader color="#fde648" :size="15" margin="1px" />
      </div>

      <custom-button v-if="!pending" type="yellow" @click="confirmSummon">Summon</custom-button>
    </div>
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
const ShowPrompt = CreateDialog(Prompt, ...Prompt.props);

export default {
  name: "raid-summon",
  mixins: [AppSection],
  props: {
    raid: String
  },
  components: { CraftingIngridient, CustomButton, PriceTag },
  created() {
    this.title = "Summon Raid";
    this.listener = this.fetchSummonStatus.bind(this);
    this.$game.on(Events.RaidSummonStatus, this.listener);
  },
  destroyed() {
    this.$game.off(Events.RaidSummonStatus, this.listener);
  },
  mounted() {
    this.$refs.stages[this.selectedStage].checked = true;
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
    }
  },
  methods: {
    async fetchSummonStatus() {
      if (this.statusFetchInProcess[this.selectedStage]) {
        return;
      }

      console.log("fetching status...");

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
.stage-selector {
  display: inline-grid;

  & input {
    appearance: none;
    margin: 0;
    padding: 0;
  }

  & label {
    transition: all 100ms ease-in;
    filter: brightness(1.8) grayscale(1) opacity(0.7);
  }

  & input:checked + label {
    filter: none;
  }
}

.raid-summon-title {
  position: absolute;
  top: 0;
}

.raid-summon-boss-image {
  height: 25vh;
  width: 100%;
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
}

.raid-summon-content {
  position: relative;
}
</style>



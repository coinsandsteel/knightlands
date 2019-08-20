<template>
  <Promised :pendingDelay="200" class="flex flex-column flex-item-center" :promise="request">
    <!-- Use the "pending" slot to display a loading message -->
    <template v-slot:pending>
      <loading-screen :loading="true" :opacity="0.4"></loading-screen>
    </template>
    <!-- The default scoped slot will be used as the result -->
    <template v-slot="data">
      <div class="flex flex-column flex-item-center panel chests-content">
        <span class="flex flex-center font-size-25 margin-bottom-5 title">Select chest</span>
        <div class="flex flex-column relative width-100">
          <div class="chests-picker relative">
            <div class="chests-picker-bg"></div>
            <presale-chest-selector :chests="chests" v-model="selectedChest" />
          </div>

          <div class="margin-top-3">
            <div class="flex flex-column flex-items-center margin-top-5">
              <span
                class="font-size-18 margin-bottom-2"
              >Select how many chests you want to transfer:</span>
              <numeric-value
                class="chests-count-input panel-dark"
                :value="chestsToTransfer"
                :decreaseCondition="chestsToTransfer > 0"
                :increaseCondition="chestsToTransfer < owned"
                @inc="chestsToTransfer++"
                @dec="chestsToTransfer--"
              ></numeric-value>
              <custom-button
                class="margin-top-5"
                :disabled="chestsToTransfer <= 0"
                @click="doTransfer"
              >Send to Knightlands</custom-button>
            </div>
          </div>
        </div>
      </div>
    </template>
    <!-- The "rejected" scoped slot will be used if there is an error -->
    <template v-slot:rejected="error">
      <div class="full-flex flex flex-center">
        <p class="font-size-20 font-error">Unexpected error.</p>
        <custom-button @click="tryAgain">Try again</custom-button>
      </div>
    </template>
  </Promised>
</template>

<script>
import CustomButton from "@/components/Button.vue";
import PresaleChestSelector from "./PresaleChestSelector.vue";
import NumericValue from "@/components/NumericValue.vue";
import LoadingScreen from "@/components/LoadingScreen.vue";
import { Promised } from "vue-promised";

export default {
  components: {
    CustomButton,
    PresaleChestSelector,
    NumericValue,
    LoadingScreen,
    Promised
  },
  data: () => ({
    request: null,
    selectedChest: 0,
    chestsToTransfer: 0,
    chests: {},
    retryMethod: null
  }),
  mounted() {
    this.fetchChests();
  },
  watch: {
    selectedChest() {
      this.chestsToTransfer = 0;
    }
  },
  computed: {
    owned() {
      return this.chests[this.selectedChest];
    }
  },
  methods: {
    tryAgain() {
      this.retryMethod.call(this);
    },
    async fetchChests() {
      this.retryMethod = this.fetchChests;

      let blockchain = this.$game.blockchainClient;
      this.request = blockchain.fetchOwnedChests();
      this.chests = await this.request;
    },
    async doTransfer() {
      this.retryMethod = this.doTransfer;

      let blockchain = this.$game.blockchainClient;
      this.request = blockchain.transferPresaleChests(
        this.selectedChest,
        this.chestsToTransfer
      );

      try {
        await this.request;
        this.chestsToTransfer = 0;
        await this.fetchChests();
      } catch {}
    }
  }
};
</script>

<style lang="less" scoped>
@import (reference) "./styles.less";

.chests-count-input {
  min-width: 15rem;
  padding: 0.3rem;
}
</style>



<template>
  <div class="flex flex-column" v-if="showMain">
    <div>
      <div class="margin-top-2 flex flex-column flex-center headline">
        <span
          class="flex flex-center font-size-18 margin-bottom-2"
        >To open chest transfer it to Knightlands first.</span>
        <custom-button type="yellow" @click="transferChests">{{$t("transfer-chests")}}</custom-button>
      </div>

      <!-- <div class="flex flex-center panel flex-column" v-if="nothingToOpen">
        <span>No chests to open</span>
        <custom-button @click="fetchChestsStatus">Refresh</custom-button>
      </div>-->

      <Promised :promise="request">
        <template v-slot:combined="{ isPending, isDelayOver }">
          <loading-screen :loading="isPending && isDelayOver"></loading-screen>
          <div class="chests-content panel flex flex-center flex-center flex-column">
            <span class="font-size-25 margin-bottom-5 title">Select chest to open</span>
            <div class="flex flex-center flex-column relative width-100">
              <div class="margin-bottom-5 relative chests-picker width-100">
                <div class="chests-picker-bg"></div>
                <presale-chest-selector v-model="selectedChest" :chests="chests"></presale-chest-selector>
              </div>

              <custom-button
                type="yellow"
                @click="openChest"
                :disabled="chests[selectedChest] <= 0"
              >{{$t('button-open')}}</custom-button>
            </div>
          </div>
        </template>

        <template v-slot:rejected="error">
          <div class="full-flex flex flex-center">
            <p class="font-size-20 font-error">Unexpected error.</p>
            <custom-button @click="fetchChestsStatus">Try again</custom-button>
          </div>
        </template>
      </Promised>
    </div>
  </div>
  <div class="flex flex-column relative full-flex" v-else>
    <chests-transfer v-if="transfer"></chests-transfer>
    <portal to="overlay">
      <chest-opening
        :openToken="openToken"
        :chestId="selectedChest"
        @continue="closeChestOpening"
        @token="handleNewToken"
        v-if="chestOpening"
      ></chest-opening>
    </portal>
    <span class="back-button" @click="handleBackButton"></span>
  </div>
</template>

<script>
import CustomButton from "@/components/Button.vue";
import ChestsTransfer from "./ChestsTransfer.vue";
import ChestOpening from "./ChestOpening.vue";
import { Promised } from "vue-promised";
import LoadingScreen from "@/components/LoadingScreen.vue";
import Config from "@/config";
import PresaleChestSelector from "./PresaleChestSelector.vue";

export default {
  components: {
    CustomButton,
    ChestsTransfer,
    Promised,
    PresaleChestSelector,
    ChestOpening
  },
  data: () => ({
    chests: {},
    transfer: false,
    chestOpening: false,
    request: null,
    selectedChest: 0,
    openToken: null
  }),
  mounted() {
    this.fetchChestsStatus();
  },
  activated() {
    this.fetchChestsStatus();
  },
  computed: {
    nothingToOpen() {
      return Object.keys(this.chests).length == 0;
    },
    showMain() {
      return !this.transfer && !this.chestOpening;
    }
  },
  methods: {
    closeChestOpening() {
      this.chestOpening = false;
      this.fetchChestsStatus();
    },
    handleNewToken(token) {
      this.openToken = token;
    },
    async openChest() {
      this.chestOpening = true;
    },
    async fetchChestsStatus() {
      this.request = this.$http.get(
        `${Config.httpEndpoint}/get/presaleChests`,
        {
          params: {
            wallet: this.$game.account
          }
        }
      );

      try {
        let chestStatus = await this.request;

        let chests = {
          0: 0,
          1: 0,
          2: 0,
          3: 0,
          4: 0
        };

        if (chestStatus.body) {
          if (chestStatus.body.chest) {
            for (let i in chestStatus.body.chest) {
              let opened = chestStatus.body.chest[i].opened || 0;
              chests[i] = chestStatus.body.chest[i].total - opened;
            }
          }
        
          this.openToken = chestStatus.body.openingToken;
        }

        this.chests = chests;
      } catch (exc) {
        console.error(exc);
      }
    },
    transferChests() {
      this.transfer = true;
    },
    handleBackButton() {
      this.transfer = false;
      this.chestOpening = false;
      this.fetchChestsStatus();
    }
  }
};
</script>

<style lang="less">
@import "./styles.less";
</style>

<style lang="less" scoped>
@import (reference) "./styles.less";

@backButtonWidth: 6rem;
@backButtonHeight: 4.2125rem;
@footerBottomPadding: 2rem;
.back-button {
  position: absolute;
  cursor: pointer;
  width: @backButtonWidth;
  height: @backButtonHeight;
  left: 2rem;
  // .mobile({width: @backButtonWidth/2; height: @backButtonHeight / 2});
  bottom: @footerBottomPadding;
  background: url("../../assets/ui/button_back.png") no-repeat;
  background-size: contain;
  z-index: 100;

  &:active {
    background: url("../../assets/ui/button_back_active.png") no-repeat;
    background-size: contain;
  }
}
</style>




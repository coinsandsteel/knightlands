<template>
  <div class="flex flex-start font-size-25 padding-1 adventures-content">
    <Promised :promise="request">
      <template v-slot:combined="{ isPending, isDelayOver }">
        <LoadingScreen :loading="isPending && isDelayOver"></LoadingScreen>

        <template v-if="selectedAventure">
          <StartAdventure
            :adventure="selectedAventure"
            :index="selectedAventureIndex"
            @start="startAdventure"
            @back="handleBackButton"
          ></StartAdventure>
        </template>

        <template v-else>
          <div class="height-100" v-bar>
            <div>
              <AdventureSlot
                v-for="(adv, index) in adventures"
                :key="index"
                :adventure="adv"
                @start="selectAdventure"
                @claim="claimAdventure(index)"
              ></AdventureSlot>

              <div
                class="panel width-100 padding-1 margin-bottom-2 adventure-slot flex flex-center"
                v-if="upgradePrice > 0"
              >
                <span class="font-size-18 grey-title">{{
                  $t("adventure-expand-message")
                }}</span>
                <div class="margin-top-2">
                  <CustomButton
                    type="yellow"
                    @click="buySlot"
                    :disabled="!enoughCurrency"
                  >
                    {{ $t("adventure-expand") }}
                    <IconWithValue iconClass="icon-gold">{{
                      upgradePrice
                    }}</IconWithValue>
                  </CustomButton>
                </div>
              </div>
            </div>
          </div>
        </template>
      </template>
    </Promised>
  </div>
</template>

<script>
import CustomButton from "@/components/Button.vue";
import AdventureSlot from "./AdventureSlot.vue";
import IconWithValue from "@/components/IconWithValue.vue";
import AdventuresMeta from "@/adventures_meta";
import StartAdventure from "./StartAdventure.vue";
import AppSection from "@/AppSection.vue";
import { Promised } from "vue-promised";
import LoadingScreen from "@/components/LoadingScreen.vue";

import AdventureRewards from "./AdventureRewards.vue";
import { create } from "vue-modal-dialogs";

const ShowRewards = create(AdventureRewards, ...AdventureRewards.props);

export default {
  mixins: [AppSection],
  components: {
    AdventureSlot,
    CustomButton,
    IconWithValue,
    StartAdventure,
    Promised,
    LoadingScreen
  },
  created() {
    this.title = "window-adventures";
  },
  data: () => ({
    adventures: [],
    selectedAventure: null,
    request: null,
    selectedAventureIndex: 0
  }),
  activated() {
    this.fetchAdventuresStatus();
  },
  computed: {
    upgradePrice() {
      if (
        !this.adventures ||
        this.adventures.length == 0 ||
        this.adventures.length >= AdventuresMeta.upgradePrice.length
      )
        return 0;
      return AdventuresMeta.upgradePrice[this.adventures.length - 1].soft;
    },
    enoughCurrency() {
      return this.upgradePrice <= this.$game.softCurrency;
    }
  },
  methods: {
    async claimAdventure(slot) {
      this.request = this.$game.claimAdventure(slot);

      let { items, adventure } = await this.request;
      if (items) {
        this.$set(this.adventures, slot, adventure);
        await ShowRewards(items);
      }
    },
    async startAdventure(adventureIndex) {
      this.request = this.$game.startAdventure(
        this.selectedAventureIndex,
        adventureIndex
      );

      let adventureUpdate = await this.request;
      this.$set(this.adventures, this.selectedAventureIndex, adventureUpdate);
      this.handleBackButton();
    },
    async buySlot() {
      let newSlot = await this.$game.buyAdventureSlot();
      if (newSlot) {
        this.adventures.push(newSlot);
      }
    },
    selectAdventure(adventure) {
      this.selectedAventure = adventure;
      this.selectedAventureIndex = this.adventures.findIndex(
        x => x == adventure
      );
    },
    async fetchAdventuresStatus() {
      this.request = this.$game.fetchAdventuresStatus();
      this.adventures = (await this.request).adventures;
    },
    handleBackButton() {
      if (this.selectedAventure) {
        this.selectedAventure = null;
        this._notifyApp();
        return true;
      }

      return false;
    }
  }
};
</script>

<style lang="less" scoped>
.adventures-content {
  & > span {
    height: 100%;
  }
}
</style>

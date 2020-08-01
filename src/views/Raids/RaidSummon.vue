<template>
  <Promised class="screen-content flex-start relative" :promise="raidStatusRequest">
    <template v-slot:combined="{ isPending, isDelayOver, data }">
      <loading-screen :loading="isPending"></loading-screen>
      <div class="screen-background"></div>
      <AnimatedBackgroundUnits></AnimatedBackgroundUnits>
      <div v-bar v-if="data">
        <div>
          <boss-view
            v-if="raid"
            :raidTemplateId="raid"
            :navigation="true"
            @next="goToNext"
            @previous="goToPrevious"
          >
            <div class="height-100 flex flex-items-end">
              <div class="width-100 flex flex-space-evenly overlay-color">
                <span class="font-size-25 font-weight-900">{{$t("unit-lvl", { lvl: raidLevel })}}</span>
                <IconWithValue
                  iconClass="icon-health"
                  valueClass="font-size-25 font-weight-900"
                >{{raidMaxHealth}}</IconWithValue>
                <IconWithValue
                  iconClass="icon-damage"
                  valueClass="font-size-25 font-weight-900"
                >{{raidAttack}}</IconWithValue>
              </div>
            </div>
          </boss-view>

          <Tabs :tabs="tabs" :currentTab="currentTab" @onClick="switchTab" />

          <div class="margin-1">
            <div class="flex flex-space-evenly width-100">
              <custom-button type="grey" class="raid-mid-btn" @click="showRewards">
                <icon-with-value
                  valueClass="font-size-20 btn-fix"
                  iconClass="icon-loot"
                >{{$t("rewards")}}</icon-with-value>
              </custom-button>

              <custom-button type="grey" class="raid-mid-btn" @click="showInfo">
                <icon-with-value
                  valueClass="font-size-20 btn-fix"
                  iconClass="icon-info dark"
                >{{$t("raid-info")}}</icon-with-value>
              </custom-button>
            </div>

            <div class="margin-top-3" v-if="$game.load">
              <div class="flex flex-center margin-top-1">
                <crafting-ingridient
                  v-for="essence in requiredEssences"
                  :key="essence.itemId"
                  :ingridient="essence"
                />
              </div>
            </div>

            <div class="margin-top-2 flex flex-column flex-center" v-if="isFreeRaid">
              <span
                v-if="!levelRequirementMet"
                class="font-error font-size-18"
              >{{$t("not-enough-level")}}</span>
              <CustomButton type="yellow" @click="confirmSummon">{{$t("btn-summon")}}</CustomButton>
            </div>

            <PaymentStatus
              v-else
              class="margin-top-2"
              :request="fetchPayment"
              @pay="continuePurchase"
            >
              <div class="flex flex-column flex-center">
                <span
                  v-if="!levelRequirementMet"
                  class="font-error font-size-18"
                >{{$t("not-enough-level")}}</span>
                <CustomButton :disabled="!canSummon" type="yellow" @click="confirmSummon">
                  <span>{{$t("btn-summon")}}</span>
                  <price-tag :iap="iap" :dark="true"></price-tag>
                </CustomButton>
              </div>
            </PaymentStatus>
          </div>
        </div>
      </div>
    </template>
  </Promised>
</template>

<script>
import RaidsMeta from "@/raids_meta";
import AppSection from "@/AppSection.vue";
import AnimatedBackgroundUnits from "@/components/AnimatedBackgroundUnits.vue";
import CraftingIngridient from "@/components/CraftingIngridient.vue";
import CustomButton from "@/components/Button.vue";
import PriceTag from "@/components/PriceTag.vue";
import Prompt from "@/components/Prompt.vue";
import PaymentStatus from "@/components/PaymentStatus.vue";
import Events from "@/../knightlands-shared/events";
import BossView from "./BossView.vue";
import Rewards from "./Rewards.vue";
import RaidInfo from "./RaidInfo.vue";
import IconWithValue from "@/components/IconWithValue.vue";
import PaymentHandler from "@/components/PaymentHandler.vue";
import throttle from "lodash.throttle";
import RaidGetterMixin from "./RaidGetterMixin.vue";
import LoadingScreen from "@/components/LoadingScreen.vue";

import { Promised } from "vue-promised";

import { create as CreateDialog } from "vue-modal-dialogs";

const ShowPrompt = CreateDialog(Prompt, ...Prompt.props);
const ShowRewards = CreateDialog(
  Rewards,
  "raidTemplateId",
  "isFreeRaid",
  "currentDamage",
  "dktFactor"
);
const ShowRaidInfo = CreateDialog(
  RaidInfo,
  "raidTemplateId",
  "isFreeRaid",
  "weakness",
  "dktFactor"
);

import Tabs from "@/components/Tabs.vue";
const FreeRaid = "free_raid";
const PayedRaid = "paid_raid";

export default {
  name: "raid-summon",
  mixins: [AppSection, PaymentHandler, RaidGetterMixin],
  props: {
    raid: [String, Number]
  },
  components: {
    LoadingScreen,
    Promised,
    CraftingIngridient,
    CustomButton,
    PriceTag,
    BossView,
    PaymentStatus,
    IconWithValue,
    Tabs,
    AnimatedBackgroundUnits
  },
  created() {
    this.title = "Summon Raid";
    this.listener = this.fetchSummonStatus.bind(this);
    this.$game.on(Events.RaidSummonStatus, this.listener);
    this.$options.paymentEvents = [Events.RaidSummonStatus];
    this._fetchSummonStatus = throttle(this.fetchSummonStatus.bind(this), 500, {
      leading: false
    });
  },
  destroyed() {
    this.$game.off(Events.RaidSummonStatus, this.listener);
  },
  mounted() {
    this._fetchSummonStatus();
    this.fetchPaymentStatus();
  },
  data() {
    return {
      raidStatusRequest: null,
      fetchPayment: null,
      listener: undefined,
      raidStatus: {},
      currentTab: PayedRaid,
      tabs: [
        {
          title: PayedRaid,
          value: PayedRaid
        },
        { title: FreeRaid, value: FreeRaid }
      ]
    };
  },
  watch: {
    raid() {
      this._fetchSummonStatus();
      this.fetchPaymentStatus();
    }
  },
  computed: {
    weakness() {
      return this.raidStatus.weakness;
    },
    dktFactor() {
      return this.raidStatus.dktFactor;
    },
    isFreeRaid() {
      return this.currentTab == FreeRaid;
    },
    iap() {
      return this.raidData.iap;
    }
  },
  methods: {
    goToNext() {
      let newRaidId = this.raid * 1 + 1;
      if (RaidsMeta.max < newRaidId) {
        newRaidId = RaidsMeta.min;
      }
      this.$router.replace({
        name: "summon-raid",
        params: { raid: newRaidId }
      });
    },
    goToPrevious() {
      let newRaidId = this.raid * 1 - 1;
      if (RaidsMeta.min > newRaidId) {
        newRaidId = RaidsMeta.max;
      }
      this.$router.replace({
        name: "summon-raid",
        params: { raid: newRaidId }
      });
    },
    showRewards() {
      ShowRewards(this.raid, this.isFreeRaid, 0, this.dktFactor);
    },
    showInfo() {
      ShowRaidInfo(this.raid, this.isFreeRaid, this.weakness, this.dktFactor);
    },
    switchTab(newTab) {
      this.currentTab = newTab;
    },
    async handlePaymentComplete(iap, item) {
      console.log(iap, item);
      // if (item) {
      //   console.log(item);
      //   await ShowItemCreated(item.recipe.resultItem, item.amount);
      //   this.ingridientsKey++;
      // }
    },
    async fetchPaymentStatus() {
      this.fetchPayment = this.$game.fetchRaidSummonStatus(this.raid);
    },
    async fetchSummonStatus() {
      this.raidStatusRequest = this.$game.fetchRaidSummonStatus(this.raid);
      this.raidStatus = await this.raidStatusRequest;
    },
    async confirmSummon() {
      this.request = this.purchaseRequest(this.$game.summonRaid(this.raid));
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



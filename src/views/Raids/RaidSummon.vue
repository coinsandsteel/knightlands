<template>
  <div class="screen-content flex-start relative">
    <div v-bar>
      <div>
        <div class="screen-background"></div>
        <boss-view v-if="raid" :raidTemplateId="raid"></boss-view>
        <div class="width-100 flex flex-space-evenly">
          <span class="font-size-25 font-weight-900">{{$t("unit-lvl", { lvl: level })}}</span>
          <IconWithValue
            iconClass="icon-health"
            valueClass="font-size-25 font-weight-900"
          >{{health}}</IconWithValue>
          <IconWithValue
            iconClass="icon-damage"
            valueClass="font-size-25 font-weight-900"
          >{{damage}}</IconWithValue>
        </div>
        <Tabs :tabs="tabs" :currentTab="currentTab" @onClick="switchTab" />
        <div class="margin-1">
          <div class="flex flex-space-evenly width-100">
            <custom-button type="grey" class="raid-mid-btn" @click="showRewards=true">
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
            <!-- <span class="font-size-20 title margin-bottom">{{$t("raid-essences")}}</span> -->
            <div class="flex flex-center margin-top-1">
              <crafting-ingridient
                v-for="essence in requiredEssences"
                :key="essence.itemId"
                :ingridient="essence"
              />
            </div>
          </div>

          <div class="margin-top-2 flex flex-column flex-center" v-if="isFreeRaid">
            <CustomButton type="yellow" @click="confirmSummon">{{$t("btn-summon")}}</CustomButton>
          </div>

          <PaymentStatus
            v-else
            class="margin-top-2 flex flex-column flex-center"
            :request="fetchPayment"
            @pay="continuePurchase"
          >
            <CustomButton :disabled="!canSummon" type="yellow" @click="confirmSummon">
              <span>{{$t("btn-summon")}}</span>
              <price-tag :iap="iap" :dark="true"></price-tag>
            </CustomButton>
          </PaymentStatus>
        </div>

            <keep-alive>
      <Rewards
        v-if="showRewards"
        :raidTemplateId="raid"
        :isFreeRaid="isFreeRaid"
        :currentDamage="0"
        :dktFactor="dktFactor"
        @close="showRewards=false"
      ></Rewards>

      <!-- <RaidInfo
        v-if="showInfo"
        :raidTemplateId="raid"
        :stage="selectedStage"
        :weakness="weakness"
        :dktFactor="dktFactor"
        @close="showInfo = false"
      ></RaidInfo> -->
    </keep-alive>
      </div>
    </div>
  </div>
</template>

<script>
import AppSection from "@/AppSection.vue";
import RaidsMeta from "@/raids_meta";
import UiConstants from "@/ui_constants";
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

import { create as CreateDialog } from "vue-modal-dialogs";

const ShowPrompt = CreateDialog(Prompt, ...Prompt.props);
const ShowRewards = CreateDialog(Rewards, "raidTemplateId", "isFreeRaid", "currentDamage", "dktFactor");
const ShowRaidInfo = CreateDialog(RaidInfo, "raidTemplateId", "isFreeRaid", "weakness", "dktFactor");

import Tabs from "@/components/Tabs.vue";
const FreeRaid = "free_raid";
const PayedRaid = "paid_raid";

export default {
  name: "raid-summon",
  mixins: [AppSection, PaymentHandler],
  props: {
    raid: [String, Number]
  },
  components: {
    CraftingIngridient,
    CustomButton,
    PriceTag,
    BossView,
    PaymentStatus,
    IconWithValue,
    Tabs,
    Rewards
  },
  created() {
    this.title = "Summon Raid";
    this.listener = this.fetchSummonStatus.bind(this);
    this.$game.on(Events.RaidSummonStatus, this.listener);
    this._fetchSummonStatus = throttle(this.fetchSummonStatus.bind(this), 500, {
      leading: false
    });
  },
  destroyed() {
    this.$game.off(Events.RaidSummonStatus, this.listener);
  },
  mounted() {
    this._fetchSummonStatus();
  },
  activated() {
    this._fetchSummonStatus();
  },
  data() {
    return {
      raidStatusRequest: null,
      fetchPayment: null,
      listener: undefined,
      showRewards: false,
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
    }
  },
  computed: {
    weakness() {
      return this.raidStatus.weakness;
    },
    dktFactor() {
      return this.raidStatus.dktFactor;
    },
    health() {
      return this.data.health;
    },
    damage() {
      return this.data.damage;
    },
    level() {
      return this.meta.level;
    },
    meta() {
      return RaidsMeta[this.raid];
    },
    isFreeRaid() {
      return this.currentTab == FreeRaid;
    },
    data() {
      return this.isFreeRaid ? this.meta.soloData : this.meta.data;
    },
    name() {
      return (this.meta || {}).name;
    },
    iap() {
      return this.data.iap;
    },
    enemyImage() {
      if (!this.meta) return "";
      return `background-image: url("${UiConstants.enemyImage(
        this.meta.icon
      )}");`;
    },
    requiredEssences() {
      if (!this.data) {
        return [];
      }

      return this.$game.crafting.getRecipeIngridients(this.data.summonRecipe);
    },
    canSummon() {
      if (!this.data) {
        return false;
      }

      return this.$game.crafting.hasEnoughResourcesForRecipe(
        this.data.summonRecipe
      );
    }
  },
  methods: {
    // showRewards() {
    //   ShowRewards(this.raid, this.isFreeRaid, 0, this.dktFactor);
    // },
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
      this.raidStatus = await this.$game.fetchRaidSummonStatus(this.raid);
      console.log(this.raidStatus);
    },
    async confirmSummon() {
      let result = await ShowPrompt(
        `Are you sure?`,
        `Selected difficulty: ${UiConstants.stageNames[this.selectedStage]}`,
        [
          { type: "green", title: "Ok", response: true },
          { type: "red", title: "Cancel", response: false }
        ]
      );

      if (result === true) {
        this.request = this.purchaseRequest(this.$game.summonRaid(this.raid));
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



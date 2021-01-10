<template>
  <div class="screen-content">
    <div class="screen-background"></div>
    <!-- <AnimatedBackgroundUnits></AnimatedBackgroundUnits> -->
    <div v-bar v-show="!showChart">
      <div>
        <boss-view
          v-if="raid"
          :raidTemplateId="raid"
          :navigation="true"
          @next="goToNext"
          @previous="goToPrevious"
        >
          <div class="height-100 flex flex-items-end">
            <div
              class="width-100 flex flex-space-evenly overlay-color padding-1"
            >
              <span class="font-size-25 font-weight-900">{{
                $t("unit-lvl", { lvl: raidLevel })
              }}</span>
              <IconWithValue
                iconClass="icon-health"
                valueClass="font-size-25 font-weight-900"
                >{{ raidMaxHealth }}</IconWithValue
              >
              <IconWithValue
                iconClass="icon-damage"
                valueClass="font-size-25 font-weight-900"
                >{{ raidAttack }}</IconWithValue
              >
            </div>
          </div>
        </boss-view>

        <Tabs :tabs="tabs" :currentTab="currentTab" @onClick="switchTab" />

        <div class="margin-1">
          <div class="flex flex-space-evenly width-100">
            <custom-button type="grey" @click="showRewards">
              <span class="icon-loot"></span>
            </custom-button>

            <custom-button type="grey" @click="showInfo">
              <span class="icon-info dark"></span>
            </custom-button>

            <custom-button type="grey" @click="showChart = true">
              <span class="icon-chart"></span>
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

          <div class="margin-top-2 flex flex-column flex-center">
            <span v-if="!levelRequirementMet" class="font-error font-size-18">{{
              $t("no-raid-level", { level: raidLevel })
            }}</span>

            <div class="flex flex-center">
              <CustomButton
                :disabled="!canSummon"
                type="yellow"
                @click="confirmSummon"
              >
                <span>{{ $t("btn-summon") }}</span>
              </CustomButton>
              <CustomButton type="grey" @click="goToShop">
                {{ $t("pur-tickets") }}
              </CustomButton>
            </div>
          </div>
        </div>
      </div>
    </div>

    <keep-alive>
      <TokenChart v-if="showChart" :raidTemplateId="raid"></TokenChart>
    </keep-alive>
  </div>
</template>

<script>
import RaidsMeta from "@/raids_meta";
import AppSection from "@/AppSection.vue";
import CraftingIngridient from "@/components/CraftingIngridient.vue";
import CustomButton from "@/components/Button.vue";
import BossView from "./BossView.vue";
import Rewards from "./Rewards.vue";
import RaidInfo from "./RaidInfo.vue";
import IconWithValue from "@/components/IconWithValue.vue";
import NetworkRequestErrorMixin from "@/components/NetworkRequestErrorMixin.vue";
import RaidGetterMixin from "./RaidGetterMixin.vue";

import { create as CreateDialog } from "vue-modal-dialogs";

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
  mixins: [AppSection, RaidGetterMixin, NetworkRequestErrorMixin],
  props: {
    raid: [String, Number]
  },
  components: {
    CraftingIngridient,
    CustomButton,
    BossView,
    IconWithValue,
    Tabs,
    TokenChart: () => import("./TokenChart.vue")
  },
  created() {
    this.title = "window-summon-raid";
  },
  data() {
    return {
      showChart: false,
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
    currentTab: {
      immediate: true,
      handler() {
        this.fetchInfo();
      }
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
    goToShop() {
      this.$router.push({
        name: "top-up"
      });
    },
    async fetchInfo() {
      this.raidStatus = await this.performRequest(
        this.$game.fetchRaidSummonStatus(this.raid, this.isFreeRaid)
      );
    },
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
    handleBackButton() {
      if (this.showChart) {
        this.showChart = false;
        return true;
      }

      this.$router.back();
      return true;
    },
    async confirmSummon() {
      const data = await this.performRequest(
        this.$game.summonRaid(this.raid, this.isFreeRaid)
      );
      this.$router.push({
        name: "view-raid",
        params: { raidId: data.raid }
      });
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

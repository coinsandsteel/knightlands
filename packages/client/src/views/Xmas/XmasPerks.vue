<template>
  <div ref="port" class="screen-content width-100">
    <div class="screen-background"></div>
    <XmasTower>
      <template>
        <a class="close-btn" @click.prevent="back"></a>

        <div class="row13 flex flex-center flex-column flex-space-evenly">
          <div class="flex flex-center flex-space-between relative">
            <div class="label-bg flex flex-center ">
              Upgrade points: {{ freePerkPoints }}
            </div>
          </div>

          <CustomButton
            type="green"
            :disabled="!rebalanceAllowed"
            @click="rebalancePerks"
          >
            Rebalance perks
            <IconWithValue iconClass="icon-sb">{{
              rebalancePriceFormatted
            }}</IconWithValue>
          </CustomButton>
        </div>
      </template>
    </XmasTower>
    <Tabs :tabs="tabs" :currentTab="currentTab" @onClick="switchTab" />

    <div class="full-flex dummy-height" v-bar>
      <div class="dummy-height">
        <div class="width-100 flex" v-if="currentTab == 'base'">
          <PerksTree
            class="flex-1"
            @unlock="unlockBranch(currencies.CURRENCY_UNIT_ESSENCE)"
            @upgrade="handleUpgrade"
            :canUnlock="canIncrease"
            :currency="currencies.CURRENCY_UNIT_ESSENCE"
            tier="all"
            :unlocked="perks[currencies.CURRENCY_UNIT_ESSENCE].unlocked"
            :perks="perks[currencies.CURRENCY_UNIT_ESSENCE].tiers.all"
            :name="currencies.CURRENCY_UNIT_ESSENCE"
            :perkLevels="perkLevels[currencies.CURRENCY_UNIT_ESSENCE]"
          />
          <PerksTree
            class="flex-1"
            @unlock="unlockBranch(currencies.CURRENCY_SANTABUCKS)"
            @upgrade="handleUpgrade"
            :canUnlock="canIncrease"
            :currency="currencies.CURRENCY_SANTABUCKS"
            tier="all"
            :unlocked="perks[currencies.CURRENCY_SANTABUCKS].unlocked"
            :perks="perks[currencies.CURRENCY_SANTABUCKS].tiers.all"
            :name="currencies.CURRENCY_SANTABUCKS"
            :perkLevels="perkLevels[currencies.CURRENCY_SANTABUCKS]"
          />
          <PerksTree
            class="flex-1"
            @unlock="unlockBranch(currencies.CURRENCY_GOLD)"
            @upgrade="handleUpgrade"
            :canUnlock="canIncrease"
            :currency="currencies.CURRENCY_GOLD"
            tier="all"
            :unlocked="perks[currencies.CURRENCY_GOLD].unlocked"
            :perks="perks[currencies.CURRENCY_GOLD].tiers.all"
            :name="currencies.CURRENCY_GOLD"
            :perkLevels="perkLevels[currencies.CURRENCY_GOLD]"
          />
        </div>

        <div class="width-100 flex flex-center" v-if="currentTab == 'cp'">
          <PerksTree
            class="flex-1"
            @unlock="unlockBranch(currencies.CURRENCY_CHRISTMAS_POINTS, 4)"
            @upgrade="handleUpgrade"
            :canUnlock="canIncrease"
            :unlocked="perks[currencies.CURRENCY_CHRISTMAS_POINTS].unlocked"
            :perks="perks[currencies.CURRENCY_CHRISTMAS_POINTS].tiers['4']"
            :perkLevels="perkLevels[currencies.CURRENCY_CHRISTMAS_POINTS]['4']"
            :currency="currencies.CURRENCY_CHRISTMAS_POINTS"
            :tier="4"
            name="Xmas Building 1"
          />
          <PerksTree
            class="flex-1"
            @unlock="unlockBranch(currencies.CURRENCY_CHRISTMAS_POINTS, 7)"
            @upgrade="handleUpgrade"
            :canUnlock="canIncrease"
            :unlocked="perks[currencies.CURRENCY_CHRISTMAS_POINTS].unlocked"
            :perks="perks[currencies.CURRENCY_CHRISTMAS_POINTS].tiers['7']"
            :currency="currencies.CURRENCY_CHRISTMAS_POINTS"
            :perkLevels="perkLevels[currencies.CURRENCY_CHRISTMAS_POINTS]['7']"
            :tier="7"
            name="Xmas Building 2"
          />
          <PerksTree
            class="flex-1"
            @unlock="unlockBranch(currencies.CURRENCY_CHRISTMAS_POINTS, 8)"
            @upgrade="handleUpgrade"
            :canUnlock="canIncrease"
            :unlocked="perks[currencies.CURRENCY_CHRISTMAS_POINTS].unlocked"
            :perks="perks[currencies.CURRENCY_CHRISTMAS_POINTS].tiers['8']"
            :currency="currencies.CURRENCY_CHRISTMAS_POINTS"
            :perkLevels="perkLevels[currencies.CURRENCY_CHRISTMAS_POINTS]['8']"
            :tier="8"
            name="Xmas Building 3"
          />
          <PerksTree
            class="flex-1"
            @unlock="unlockBranch(currencies.CURRENCY_CHRISTMAS_POINTS, 9)"
            @upgrade="handleUpgrade"
            :canUnlock="canIncrease"
            :unlocked="perks[currencies.CURRENCY_CHRISTMAS_POINTS].unlocked"
            :perks="perks[currencies.CURRENCY_CHRISTMAS_POINTS].tiers['9']"
            :currency="currencies.CURRENCY_CHRISTMAS_POINTS"
            :perkLevels="perkLevels[currencies.CURRENCY_CHRISTMAS_POINTS]['9']"
            :tier="9"
            name="Xmas Building 4"
          />
        </div>

        <div class="width-100 flex flex-center" v-if="currentTab == 'shinies'">
          <PerksTree
            class="flex-1"
            @unlock="unlockBranch(currencies.CURRENCY_SHINIES)"
            @upgrade="handleUpgrade"
            :canUnlock="canIncrease"
            :unlocked="perks[currencies.CURRENCY_SHINIES].unlocked"
            :perks="perks[currencies.CURRENCY_SHINIES].tiers.all"
            :currency="currencies.CURRENCY_SHINIES"
            :perkLevels="perkLevels[currencies.CURRENCY_SHINIES]"
            tier="all"
            :name="currencies.CURRENCY_SHINIES"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import _ from "lodash";
import { mapState } from "vuex";
import CustomButton from "@/components/Button.vue";
import IconWithValue from "@/components/IconWithValue.vue";
import NumericValue from "@/components/NumericValue.vue";
import PromptMixin from "@/components/PromptMixin.vue";
import PerksTree from "./PerksTree.vue";
import XmasTower from "./XmasTower.vue";
import Tabs from "@/components/Tabs.vue";
import NetworkRequestErrorMixin from "@/components/NetworkRequestErrorMixin.vue";
import { abbreviateNumber } from "../../../../knightlands-shared/xmas";

import { create } from "vue-modal-dialogs";
import UpgradePerk from "./UpgradePerk.vue";
const ShowUpgradePerk = create(UpgradePerk, "currency", "tier", "perkName");

import {
  CURRENCY_SANTABUCKS,
  CURRENCY_GOLD,
  CURRENCY_CHRISTMAS_POINTS,
  CURRENCY_UNIT_ESSENCE,
  CURRENCY_SHINIES,
  perkLevels
} from "@/../../knightlands-shared/xmas";

export default {
  mixins: [PromptMixin, NetworkRequestErrorMixin],
  components: {
    Tabs,
    PerksTree,
    IconWithValue,
    XmasTower,
    CustomButton,
    NumericValue
  },
  watch: {
    perks: {
      deep: true,
      immediate: true,
      handler() {
        this.init();
      }
    }
  },
  data: () => ({
    newPerks: {},
    perkLevels,
    newBurstPerks: {},
    currencies: {
      CURRENCY_SANTABUCKS: CURRENCY_SANTABUCKS,
      CURRENCY_CHRISTMAS_POINTS: CURRENCY_CHRISTMAS_POINTS,
      CURRENCY_GOLD: CURRENCY_GOLD,
      CURRENCY_UNIT_ESSENCE: CURRENCY_UNIT_ESSENCE,
      CURRENCY_SHINIES: CURRENCY_SHINIES
    },
    tabs: [
      {
        value: "base",
        title: "Base"
      },
      {
        value: "cp",
        title: "Xmas Points"
      },
      {
        value: "shinies",
        title: "Shinies"
      }
    ],
    currentTab: "base"
  }),
  methods: {
    handleUpgrade(currency, tier, perkName) {
      ShowUpgradePerk(currency, tier, perkName);
    },
    switchTab(newTab) {
      this.currentTab = newTab;
    },
    unlockBranch(currencyName) {
      if (this.canIncrease) {
        this.newPerks[currencyName].unlocked = true;
        this.performRequest(
          this.$store.dispatch("xmas/commitPerks", {
            perks: this.newPerks,
            burstPerks: this.newBurstPerks
          })
        );
      }
    },
    back() {
      this.$store.dispatch("xmas/toggleFlag", "perks");
    },
    init() {
      let perksClone = _.cloneDeep(this.perks);
      for (let currencyName in perksClone) {
        if (_.isUndefined(this.newPerks[currencyName])) {
          this.$set(this.newPerks, currencyName, {});
          this.$set(
            this.newPerks[currencyName],
            "unlocked",
            perksClone[currencyName].unlocked
          );
          this.$set(this.newPerks[currencyName], "tiers", {});
        }
        for (let tier in perksClone[currencyName].tiers) {
          if (_.isUndefined(this.newPerks[currencyName].tiers[tier])) {
            this.$set(this.newPerks[currencyName].tiers, tier, {});
          }
          for (let perkName in perksClone[currencyName].tiers[tier]) {
            this.$set(
              this.newPerks[currencyName].tiers[tier],
              perkName,
              perksClone[currencyName].tiers[tier][perkName]
            );
          }
        }
      }

      let burstPerksClone = _.cloneDeep(this.burstPerks);
      for (let perkName in burstPerksClone) {
        this.$set(this.newBurstPerks, perkName, burstPerksClone[perkName]);
      }
    },
    getStatValue(currencyName, tier, perkName) {
      return this.newPerks[currencyName].tiers[tier][perkName].level;
    },
    getMaxStatValue() {
      return (
        this.tower.level - this.newUnlockedBranchesCount - this.newPerksSum - 1
      );
    },
    canDecrease(currencyName, tier, perkName) {
      return (
        this.newPerks[currencyName].tiers[tier][perkName].level >
        this.perks[currencyName].tiers[tier][perkName].level
      );
    },
    increaseAttribute(currencyName, tier, perkName) {
      this.newPerks[currencyName].tiers[tier][perkName].level++;
      return true;
    },
    decreaseAttribute(currencyName, tier, perkName) {
      this.newPerks[currencyName].tiers[tier][perkName].level--;
      return true;
    },
    confirmPerks() {
      this.performRequest(
        this.$store.dispatch("xmas/commitPerks", {
          perks: this.newPerks,
          burstPerks: this.newBurstPerks
        })
      );
    },
    /*reset(currencyName, tier, perkName) {
      while (this.canDecrease(currencyName, tier, perkName)) {
        this.decreaseAttribute(currencyName, tier, perkName);
      }
    },*/
    resetPerks() {
      let perksClone = _.cloneDeep(this.perks);
      for (let currencyName in this.newPerks) {
        for (let tier in this.newPerks[currencyName].tiers) {
          for (let perkName in this.newPerks[currencyName].tiers[tier]) {
            this.newPerks[currencyName].tiers[tier][perkName] = {
              ...this.newPerks[currencyName].tiers[tier][perkName],
              ...perksClone[currencyName].tiers[tier][perkName]
            };
          }
        }
      }

      let burstPerksClone = _.cloneDeep(this.burstPerks);
      for (let perkName in this.newBurstPerks) {
        this.newBurstPerks[perkName] = {
          ...this.newBurstPerks[perkName],
          ...burstPerksClone[perkName]
        };
      }
    },
    async rebalancePerks() {
      // Modal
      const result = await this.showPrompt(
        "Rebalance all perks",
        "Are you sure you want to rebalance all the tower perks?",
        [
          {
            type: "red",
            title: this.$t("btn-cancel"),
            response: false
          },
          {
            type: "green",
            title: this.$t("btn-ok"),
            response: true
          }
        ]
      );

      if (!result) {
        return;
      }

      this.$store.dispatch("xmas/rebalancePerks");
    }
  },
  computed: {
    rebalancePriceFormatted() {
      return abbreviateNumber(this.rebalance.price);
    },
    newUnlockedBranchesCount() {
      let sum = 0;
      for (let currencyName in this.newPerks) {
        sum += this.newPerks[currencyName].unlocked ? 1 : 0;
      }
      return sum;
    },
    unlockedBranchesCount() {
      let sum = 0;
      for (let currencyName in this.perks) {
        sum += this.perks[currencyName].unlocked ? 1 : 0;
      }
      return sum;
    },
    newPerksSum() {
      let sum = 0;
      for (let currencyName in this.newPerks) {
        for (let tier in this.newPerks[currencyName].tiers) {
          sum += _.sum(
            _.map(
              Object.values(this.newPerks[currencyName].tiers[tier]),
              "level"
            )
          );
        }
      }
      for (let perkName in this.newBurstPerks) {
        sum += this.newBurstPerks[perkName].level;
      }
      return sum;
    },
    perksSum() {
      let sum = 0;
      for (let currencyName in this.perks) {
        for (let tier in this.perks[currencyName].tiers) {
          sum += _.sum(
            _.map(Object.values(this.perks[currencyName].tiers[tier]), "level")
          );
        }
      }
      for (let perkName in this.burstPerks) {
        sum += this.burstPerks[perkName].level;
      }
      return sum;
    },
    perksModified() {
      for (let currencyName in this.newPerks) {
        for (let tier in this.newPerks[currencyName].tiers) {
          for (let perkName in this.newPerks[currencyName].tiers[tier]) {
            if (
              this.newPerks[currencyName].tiers[tier][perkName].level !==
              this.perks[currencyName].tiers[tier][perkName].level
            ) {
              return true;
            }
          }
        }
      }
      for (let perkName in this.burstPerks) {
        if (
          this.newBurstPerks[perkName].level !== this.burstPerks[perkName].level
        ) {
          return true;
        }
      }
      return false;
    },
    freePerkPoints() {
      return this.tower.level - this.unlockedBranchesCount - this.perksSum;
    },
    canIncrease() {
      return this.newPerksSum - this.perksSum < this.freePerkPoints;
    },
    upgradeAllowed() {
      return this.freePerkPoints > 0;
    },
    rebalanceAllowed() {
      return this.perksSum > 0 && this.rebalance.price <= this.sbBalance;
    },
    ...mapState({
      tower: state => state.xmas.tower,
      perks: state => state.xmas.perks,
      rebalance: state => state.xmas.rebalance,
      sbBalance: state => state.xmas.balance[CURRENCY_SANTABUCKS]
    })
  }
};
</script>

<style lang="less" scoped>
// .perks-port {
//   position: absolute;
//   top: 0;
//   z-index: 75;
//   background: rgb(49, 49, 49);
//   color: white;
// }
.perks-wrap {
  padding-top: 0;
}
.currency-wrap {
  margin-bottom: 7rem;
  text-align: center;
}
.perk-item,
.currency-item {
  margin-bottom: 1rem;
  padding: 2rem 0;
}
.perk-item {
  background: rgb(90, 103, 116);
  padding: 1rem;
}
.currency-item {
  background: seagreen;
  padding: 2rem 0;
}
.tier-item {
  background: hotpink;
  padding: 1rem 0;
}
.lvl {
  font-weight: 600;
}
.close-btn {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
}
.state-locked .tier-wrap {
  opacity: 0.35;
}

.label-bg {
  border-image: url("../../assets/xmas/text_input_blue.png");
  border-image-slice: 27 27 27 27 fill;
  border-image-width: 14px;
  border-image-outset: 0px 0px 0px 0px;
  border-image-repeat: stretch stretch;
  padding: 1rem;
}

& .row13 {
  grid-row: ~"1/4";
  grid-column: 2;
}
</style>

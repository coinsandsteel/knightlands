<template>
  <div ref="port" class="perks-port relative width-100 height-100">
    <div
      class="stat-commit font-size-25 flex flex-center width-100 margin-top-2 margin-bottom-2 flex-evenly-spaced margin-bottom-3"
    >
      <div class="width-100 margin-bottom-1">
        <strong>TOWER lvl. {{ tower.level }}</strong>
      </div>
      <CustomButton
        :disabled="!rebalanceAllowed"
        type="blue"
        @click="rebalancePerks"
      >
        {{ $t("rebalance") }}
      </CustomButton>
      <CustomButton v-show="perksModified" @click="resetPerks">{{
        $t("btn-reset")
      }}</CustomButton>
      <CustomButton
        v-show="perksModified"
        type="green"
        @click="confirmPerks"
        id="apply-btn"
        >{{ $t("btn-apply") }}</CustomButton
      >
      <a class="close-btn" @click.prevent="back"></a>
    </div>
    <div class="height-100" v-bar>
      <div class="perks-wrap padding-5 font-size-25">
        <div
          class="currency-wrap"
          :class="currencyData.unlocked ? 'state-unlocked' : 'state-locked'"
          v-for="(currencyData, currencyName) in perks"
          :key="currencyName"
        >
          <div class="currency-item">
            <strong>{{ currencyName }}</strong>
            &nbsp;
            <CustomButton
              v-show="!currencyData.unlocked && canIncrease"
              @click="unlockBranch(currencyName)"
              >Unlock</CustomButton
            >
          </div>
          <div
            class="tier-wrap"
            v-for="(tierData, tier) in currencyData.tiers"
            :key="currencyName + '_tier_' + tier"
          >
            <div class="tier-item" v-if="tier !== 'all'">
              <strong>Tier {{ tier }}</strong>
            </div>
            <div
              class="perk-item flex"
              v-for="(perkData, perkName) in tierData"
              :key="currencyName + '_tier_' + tier + '_perk_' + perkName"
            >
              <NumericValue
                v-if="upgradeAllowed && currencyData.unlocked"
                :id="'perk_' + currencyName + '_' + perkName"
                :showMax="true"
                :noExtra="true"
                :rowStyle="{ 'align-items': 'center' }"
                :btnStyle="{ width: '1em', height: '1em' }"
                :value="getStatValue(currencyName, tier, perkName)"
                :maxValue="getMaxStatValue(currencyName, perkName)"
                :decreaseCondition="canDecrease(currencyName, tier, perkName)"
                :increaseCondition="canIncrease"
                @inc="increaseAttribute(currencyName, tier, perkName)"
                @dec="decreaseAttribute(currencyName, tier, perkName)"
                @reset="reset(currencyName, tier, perkName)"
              />
              &nbsp;lvl&nbsp;{{ perkData.level }}&nbsp;<strong>{{
                perkName
              }}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="font-size-25" @click="back">Close</div>
  </div>
</template>

<script>
import _ from "lodash";
import { mapState } from "vuex";
import CustomButton from "@/components/Button.vue";
import NumericValue from "@/components/NumericValue.vue";
import PromptMixin from "@/components/PromptMixin.vue";

export default {
  mixins: [PromptMixin],
  components: {
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
    newPerks: {}
  }),
  methods: {
    unlockBranch(currencyName) {
      if (this.canIncrease) {
        this.newPerks[currencyName].unlocked = true;
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
    },
    getStatValue(currencyName, tier, perkName) {
      return this.newPerks[currencyName].tiers[tier][perkName].level;
    },
    // TODO charge 1 level for branch reveal
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
      this.$store.dispatch("xmas/commitPerks", this.newPerks);
    },
    reset(currencyName, tier, perkName) {
      while (this.canDecrease(currencyName, tier, perkName)) {
        this.decreaseAttribute(currencyName, tier, perkName);
      }
    },
    resetPerks() {
      let perksClone = _.cloneDeep(this.perks);
      for (let currencyName in this.newPerks) {
        for (let tier in this.newPerks[currencyName].tiers) {
          for (let perkName in this.newPerks[currencyName].tiers[tier]) {
            this.newPerks[currencyName].tiers[tier][perkName].level =
              perksClone[currencyName].tiers[tier][perkName].level;
          }
        }
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

      let newPerks = _.cloneDeep(this.perks);
      for (let currencyName in newPerks) {
        for (let tier in newPerks[currencyName].tiers) {
          for (let perkName in newPerks[currencyName].tiers[tier]) {
            newPerks[currencyName].tiers[tier][perkName].level = 0;
          }
        }
      }
      this.$store.dispatch("xmas/commitPerks", newPerks);
    }
  },
  computed: {
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
      return sum;
    },
    perksModified() {
      for (let currencyName in this.newPerks) {
        if (
          this.newPerks[currencyName].unlocked !==
          this.perks[currencyName].unlocked
        ) {
          return true;
        }
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
      return false;
    },
    canIncrease() {
      return (
        this.newPerksSum < this.tower.level - this.newUnlockedBranchesCount - 1
      );
    },
    upgradeAllowed() {
      return this.perksSum < this.tower.level - this.unlockedBranchesCount - 1;
    },
    rebalanceAllowed() {
      return this.perksSum > 0;
    },
    ...mapState({
      tower: state => state.xmas.tower,
      perks: state => state.xmas.perks
    })
  }
};
</script>

<style lang="less" scoped>
.perks-port {
  position: absolute;
  top: 0;
  z-index: 75;
  background: rgb(49, 49, 49);
  color: white;
}
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
  top: 2.5rem;
  right: 2.5rem;
}
.state-locked .tier-wrap {
  opacity: 0.35;
}
</style>

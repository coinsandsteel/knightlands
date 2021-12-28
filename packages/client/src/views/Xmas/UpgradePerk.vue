<template>
  <UserDialog @close="$close(true)" title="Upgrade perk">
    <template v-slot:content>
      <div class="flex flex-column flex-center">
        <div class="flex flex-center">
          <PerkIcon
            :perk="perkName"
            :level="getStatValue(currency, tier, perkName)"
            class="margin-right-1"
          />
          <span class="font-size-20">{{
            $t(`d-${perkName}`, { n: value })
          }}</span>
        </div>

        <NumericValue
          class="margin-top-4"
          :id="'perk_' + currency + '_' + perkName"
          :showMax="true"
          :noExtra="true"
          :rowStyle="{ 'align-items': 'center' }"
          :btnStyle="{ width: '1em', height: '1em' }"
          :value="getStatValue(currency, tier, perkName)"
          :maxValue="freePerkPoints"
          :decreaseCondition="canDecrease(currency, tier, perkName)"
          :increaseCondition="canIncrease"
          @inc="increaseAttribute(currency, tier, perkName)"
          @dec="decreaseAttribute(currency, tier, perkName)"
          @reset="reset(currency, tier, perkName)"
        />

        <div class="flex flex-center margin-top-4">
          <CustomButton type="red" @click="$close(false)">{{
            $t("btn-cancel")
          }}</CustomButton>
          <CustomButton
            type="green"
            :disabled="!perksModified"
            @click="confirmPerks"
            >{{ $t("btn-confirm") }}</CustomButton
          >
        </div>
      </div>
    </template>
  </UserDialog>
</template>

<script>
import _ from "lodash";
import UserDialog from "@/components/UserDialog.vue";
import NumericValue from "@/components/NumericValue.vue";
import { mapState } from "vuex";
import CustomButton from "@/components/Button.vue";
import PerkIcon from "./PerkIcon.vue";
import {
  TOWER_PERK_CYCLE_DURATION,
  TOWER_PERK_INCOME,
  TOWER_PERK_UPGRADE,
  TOWER_PERK_AUTOCYCLES_COUNT,
  TOWER_PERK_BOOST,
  TOWER_PERK_SPEED,
  TOWER_PERK_SUPER_BOOST,
  TOWER_PERK_SUPER_SPEED,
  TOWER_PERK_PRESENT,
  TOWER_PERK_SLEEP,
  getMainTowerPerkValue
} from "../../../../knightlands-shared/xmas";

export default {
  components: {
    UserDialog,
    NumericValue,
    PerkIcon,
    CustomButton
  },
  props: ["currency", "tier", "perkName"],
  data: () => ({
    newPerks: {},
    newBurstPerks: {}
  }),
  created() {
    this.init();
  },
  computed: {
    value() {
      let rawValue = getMainTowerPerkValue(
        +this.tier,
        this.perkName,
        this.getStatValue(this.currency, this.tier, this.perkName),
        this.currency
      );

      if ([
        TOWER_PERK_CYCLE_DURATION,
        TOWER_PERK_INCOME,
        TOWER_PERK_UPGRADE
      ].includes(this.perkName)) {
        rawValue *= 100;
      }

      return Math.floor(rawValue * 1000) / 1000;
    },
    perk() {
      return this.perks[this.currency].tiers[this.tier];
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
    currentLevel() {
      return this.perks[this.currency].tiers[this.tier][this.perkName].level;
    },
    freePerkPoints() {
      return this.tower.level - this.unlockedBranchesCount - this.perksSum;
    },
    canIncrease() {
      return this.newPerksSum - this.perksSum < this.freePerkPoints;
    },
    ...mapState({
      tower: state => state.xmas.tower,
      perks: state => state.xmas.perks
    })
  },
  methods: {
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
      this.$store.dispatch("xmas/commitPerks", {
        perks: this.newPerks,
        burstPerks: this.newBurstPerks
      });
      this.$close(true);
    },
    reset(currencyName, tier, perkName) {
      while (this.canDecrease(currencyName, tier, perkName)) {
        this.decreaseAttribute(currencyName, tier, perkName);
      }
    }
  }
};
</script>

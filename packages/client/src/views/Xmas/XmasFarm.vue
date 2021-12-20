<template>
  <div
    ref="farm"
    class="building font-size-25"
    :class="[
      !slot.level ? 'building-slot' : 'building-farm',
      slot.level ? 'building-mode-' + mode : null
    ]"
    @click="handleClick"
  >
    <IncomeText v-for="income in incomes" :key="income.id">{{
      income.income
    }}</IncomeText>

    <template v-if="mode === 'manage'">
      TIER: {{ tier }}<br />
      Level: <span v-html="level"></span><br />
      <template v-if="!slot.level">
        Build price {{ upgradePriceFormatted }} SB
      </template>
      <template v-else>
        <span :style="{ color: !canAffordUpgrade ? 'orangered' : null }"
          >Upgrade price {{ upgradePriceFormatted }} SB</span
        >
      </template>
    </template>

    <template v-if="mode === 'collect'">
      TIER:&nbsp;{{ tier }}<br />
      Power:&nbsp;<span v-html="power" />&nbsp;{{ slot.currency }}<br />
      Power exp:&nbsp;{{ powerExp }}&nbsp;exp.<br />
      Cycle length:&nbsp;{{
        slotComputedCached.cycleLength
      }}&nbsp;sec.<br /><br />
      Auto-cycles left:&nbsp;{{ slot.autoCyclesLeft }}<br />
      Auto-cycles spent:&nbsp;{{ slot.autoCyclesSpent }}<br />
      Accumulated:&nbsp;{{ totalCurrencyIncomeValueFormatted }}&nbsp;{{ slot.currency }}<br />
      Accumulated exp:&nbsp;{{ totalExpIncomeValueFormatted }}&nbsp;exp.
    </template>

    <progress-bar
      class="progress-bar"
      v-if="slot.level && progress !== null"
      ref="progress"
      barClasses="no-animation"
      :maxValue="100"
      :percentMode="false"
      :hideMaxValue="false"
      v-model="progress"
      barType="green"
    ></progress-bar>
  </div>
</template>

<script>
// import _ from "lodash";
import ProgressBar from "@/components/ProgressBar.vue";
import IncomeText from "./IncomeText.vue";
import PromptMixin from "@/components/PromptMixin.vue";
import { mapState } from "vuex";

import {
  abbreviateNumber,
  CURRENCY_SANTABUCKS
} from "../../../../knightlands-shared/xmas";

export default {
  props: ["tier"],
  mixins: [PromptMixin],
  components: {
    IncomeText,
    ProgressBar
  },
  data: () => ({
    cycleLengthCached: 10,
    totalCurrencyIncomeValue: 0,
    totalExpIncomeValue: 0,
    progress: 0,
    animation: null,
    incomeId: 0,
    incomes: [],
    slotComputedCached: null
  }),
  created() {
    this.slotComputedCached = this.$store.getters["xmas/slotComputed"](
      this.tier
    );
  },
  watch: {
    "slot.level": function(value) {
      if (value === 1) {
        this.resetTimer();
      }
    },
    slotsComputedHash: function() {
      this.slotComputedCached = this.$store.getters["xmas/slotComputed"](
        this.tier
      );
      //console.log("[Tier " + this.tier + "] watcher slotsComputedHash", value, _.cloneDeep(this.slotComputedCached));
    }
  },
  computed: {
    slot() {
      return this.$store.getters["xmas/slot"](this.tier);
    },
    level() {
      if (this.slot.level > 0 && this.levelGap > 1) {
        return (
          '<span style="color: cyan">' +
          this.slot.level +
          "&nbsp;&rarr;&nbsp;" +
          this.slotComputedCached.upgradePrice.nextLevel +
          "</span>"
        );
      } else {
        return this.slot.level;
      }
    },
    upgradePriceFormatted() {
      return abbreviateNumber(this.slotComputedCached.upgradePrice.value);
    },
    power() {
      if (this.slot.level > 0 && this.levelGap > 1) {
        return (
          '<span style="color: cyan">' +
          this.currentCurrencyIncomeValueFormatted +
          "&nbsp;&rarr;&nbsp;" +
          this.nextCurrencyIncomeValueFormatted +
          "</span>"
        );
      } else {
        return this.currentCurrencyIncomeValueFormatted;
      }
    },
    powerExp() {
      return abbreviateNumber(
        this.slotComputedCached.incomeValue.current.expIncomePerCycle
      );
    },
    currentCurrencyIncomeValueFormatted() {
      return abbreviateNumber(
        this.slotComputedCached.incomeValue.current.currencyIncomePerCycle
      );
    },
    nextCurrencyIncomeValueFormatted() {
      return abbreviateNumber(
        this.slotComputedCached.incomeValue.next.currencyIncomePerCycle
      );
    },
    totalCurrencyIncomeValueFormatted() {
      return abbreviateNumber(this.totalCurrencyIncomeValue);
    },
    totalExpIncomeValueFormatted() {
      return abbreviateNumber(this.totalExpIncomeValue);
    },
    tier6IsNotReady() {
      return (
        this.tier == 6 &&
        this.slotComputedCached.incomeValue.current.currencyIncomePerCycle < 1
      );
    },
    switchableTotalIncomeValue() {
      if (this.tier6IsNotReady) {
        return this.totalExpIncomeValue;
      } else {
        return this.totalCurrencyIncomeValue;
      }
    },
    buildingIsAllowed() {
      if (this.tier == 1) {
        return true;
      }
      return this.slots[this.tier - 1].level >= 50;
    },
    canAffordUpgrade() {
      return this.slotComputedCached.upgradePrice.value <= this.sbBalance;
    },
    ...mapState({
      mode: state => state.xmas.mode,
      slots: state => state.xmas.slots,
      slotsComputedHash: state => state.xmas.slotsComputedHash,
      sbBalance: state => state.xmas.balance[CURRENCY_SANTABUCKS],
      levelGap: state => state.xmas.levelGap
    })
  },
  beforeDestroy() {
    this.$app.$off("farm-blur");
  },
  methods: {
    resetTimer() {
      this.progress = 0;
      if (this.animation) {
        clearInterval(this.animation);
      }

      this.animation = setInterval(() => {
        let currentIncomeValue = this.slotComputedCached.incomeValue.current;

        this.progress++;
        if (!this.tier6IsNotReady) {
          this.totalCurrencyIncomeValue +=
            currentIncomeValue.currencyIncomePerCycle / 200;
        }
        this.totalExpIncomeValue += currentIncomeValue.expIncomePerCycle / 200;

        // Add 50% of resources at the end
        if (this.progress >= 100) {
          if (!this.tier6IsNotReady) {
            this.totalCurrencyIncomeValue +=
              currentIncomeValue.currencyIncomePerCycle / 2;
          }
          this.totalExpIncomeValue += currentIncomeValue.expIncomePerCycle / 2;

          if (this.slot.autoCyclesLeft > 0) {
            this.$store.dispatch("xmas/cycleFinished", this.tier);
            this.resetTimer();
          } else {
            this.$store.dispatch("xmas/epochFinished", this.tier);
            clearInterval(this.animation);
          }
        }
      }, (this.slotComputedCached.cycleLength * 1000) / 100);
    },
    async handleClick() {
      const level = this.slot.level;

      // Empty slot
      if (level === 0) {
        if (!this.buildingIsAllowed) {
          await this.showPrompt(
            "Upgrade previous farm",
            `In order to build this farm you should upgrade the previous farm to 50-th level `,
            [
              {
                type: "grey",
                title: this.$t("btn-ok"),
                response: true
              }
            ]
          );
          return;
        }

        const result = await this.showPrompt(
          "Building a farm",
          `Are you sure you want to build a farm for ${this.upgradePriceFormatted} SB?`,
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

        this.$store.dispatch("xmas/upgradeSlot", { tier: this.tier, level: 1 });

        // Existing farm
      } else {
        if (this.mode === "manage") {
          if (!this.canAffordUpgrade) {
            return;
          }

          this.$store.commit("xmas/decreaseBalance", {
            currency: CURRENCY_SANTABUCKS,
            amount: this.slotComputedCached.upgradePrice.value
          });
          this.$store.dispatch("xmas/upgradeSlot", {
            tier: this.tier,
            level: this.slotComputedCached.upgradePrice.nextLevel
          });
          this.reset();
        } else if (this.mode === "collect") {
          this.handleHarvest();
        }
      }
    },
    handleHarvest() {
      if (!this.tier6IsNotReady) {
        this.incomes.push({
          income: this.totalIncomeValueFormatted,
          id: this.incomeId++
        });
      }
      this.$store.dispatch("xmas/addExpirience", this.totalExpIncomeValue);
      this.$store.commit("xmas/increaseBalance", {
        currency: this.slot.currency,
        amount: this.totalCurrencyIncomeValue
      });

      setTimeout(() => {
        this.incomes.splice(0, 1);
      }, 3000);

      this.reset();
    },
    reset() {
      this.$store.dispatch("xmas/epochFinished", this.tier);
      this.resetTimer();
      this.progress = 0;
      this.totalCurrencyIncomeValue = 0;
      this.totalExpIncomeValue = 0;
    }
  }
};
</script>

<style lang="less" scoped>
.building {
  position: relative;
  text-align: center;
  color: black;
  margin-bottom: 5rem;
}
.building-farm {
  padding: 5rem 0;
}
.building-slot {
  padding: 5rem 0;
  background: grey;
  opacity: 0.8;
}
.building-farm {
  background: aquamarine;
  &.building-mode-manage {
    background: darkslateblue;
    color: white;
  }
  &.building-mode-collect {
    background: darkgreen;
    color: white;
  }
}
.progress-bar {
  position: absolute;
  bottom: 0;
}
</style>

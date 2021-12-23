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
      Cycle length:&nbsp;{{ slot.stats.cycleLength }}&nbsp;sec.<br /><br />
      Auto-cycles left:&nbsp;{{ slot.progress.autoCyclesLeft }}<br />
      Auto-cycles spent:&nbsp;{{ slot.progress.autoCyclesSpent }}<br />
      Accumulated:&nbsp;{{ localCurrencyIncomeValueFormatted }}&nbsp;{{
        slot.currency
      }}<br />
      Accumulated exp:&nbsp;{{ localExpIncomeValueFormatted }}&nbsp;exp.
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
import NetworkRequestErrorMixin from "@/components/NetworkRequestErrorMixin.vue";
import { mapState } from "vuex";

import {
  abbreviateNumber,
  CURRENCY_SANTABUCKS
} from "../../../../knightlands-shared/xmas";

export default {
  props: ["tier"],
  mixins: [PromptMixin, NetworkRequestErrorMixin],
  components: {
    IncomeText,
    ProgressBar
  },
  data: () => ({
    localCurrencyIncomeValue: 0,
    localExpIncomeValue: 0,
    progress: 0,
    animation: null,
    incomeId: 0,
    incomes: []
  }),
  watch: {
    "slot.launched": {
      immediate: true,
      handler: function(value) {
        if (value) {
          this.resetTimer(this.tier);
        }
      }
    },
    "slot.progress.percentage": {
      immediate: true,
      handler: function(value) {
        this.progress = value;
      }
    },
    "slot.accumulated.currency": {
      immediate: true,
      handler: function(value) {
        this.localCurrencyIncomeValue = value;
      }
    },
    "slot.accumulated.exp": {
      immediate: true,
      handler: function(value) {
        this.localExpIncomeValue = value;
      }
    }
  },
  created() {
    this.$store.$app.$on("cycle-start", this.resetTimer);
    this.$store.$app.$on("cycle-stop", this.cycleStop);
    this.$store.$app.$on("accumulated", this.accumulated);
  },
  destroyed() {
    this.$store.$app.$off("cycle-start");
    this.$store.$app.$off("cycle-stop");
    this.$store.$app.$off("accumulated");
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
          this.slot.stats.upgrade.nextLevel +
          "</span>"
        );
      } else {
        return this.slot.level;
      }
    },
    upgradePriceFormatted() {
      return abbreviateNumber(this.slot.stats.upgrade.value);
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
      return abbreviateNumber(this.slot.stats.income.current.expPerCycle);
    },
    currentCurrencyIncomeValueFormatted() {
      return abbreviateNumber(this.slot.stats.income.current.currencyPerCycle);
    },
    nextCurrencyIncomeValueFormatted() {
      return abbreviateNumber(this.slot.stats.income.next.currencyPerCycle);
    },
    localCurrencyIncomeValueFormatted() {
      return abbreviateNumber(this.localCurrencyIncomeValue);
    },
    localExpIncomeValueFormatted() {
      return abbreviateNumber(this.localExpIncomeValue);
    },
    tier6IsNotReady() {
      return (
        this.tier == 6 && this.slot.stats.income.current.currencyPerCycle < 1
      );
    },
    switchableTotalIncomeValue() {
      if (this.tier6IsNotReady) {
        return this.localExpIncomeValue;
      } else {
        return this.localCurrencyIncomeValue;
      }
    },
    buildingIsAllowed() {
      if (this.tier == 1) {
        return true;
      }
      return this.slots[this.tier - 1].level >= 50;
    },
    canAffordUpgrade() {
      return this.slot.stats.upgrade.value <= this.sbBalance;
    },
    ...mapState({
      mode: state => state.xmas.mode,
      slots: state => state.xmas.slots,
      sbBalance: state => state.xmas.balance[CURRENCY_SANTABUCKS],
      levelGap: state => state.xmas.levelGap
    })
  },
  methods: {
    accumulated(payload) {
      if (this.tier != payload.tier) {
        return;
      }
      this.localCurrencyIncomeValue = payload.currency;
      this.localExpIncomeValue = payload.exp;
    },
    cycleStop(tier) {
      if (this.tier != tier) {
        return;
      }
      if (this.animation) {
        clearInterval(this.animation);
      }
      this.progress = 0;
    },
    resetTimer(tier) {
      if (this.tier != tier) {
        return;
      }

      this.progress = 0;
      if (this.animation) {
        clearInterval(this.animation);
      }

      this.animation = setInterval(() => {
        let currentIncomeValue = this.slot.stats.income.current;

        this.progress++;
        if (!this.tier6IsNotReady) {
          this.localCurrencyIncomeValue +=
            currentIncomeValue.currencyPerCycle / 200;
        }
        this.localExpIncomeValue += currentIncomeValue.expPerCycle / 200;

        if (this.progress >= 100) {
          clearInterval(this.animation);
        }
      }, (this.slot.stats.cycleLength * 1000) / 100);
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

        await this.performRequestNoCatch(
          this.$store.dispatch("xmas/upgradeSlot", { tier: this.tier })
        );

        // Existing farm
      } else {
        if (this.mode === "manage") {
          if (!this.canAffordUpgrade) {
            return;
          }

          await this.performRequestNoCatch(
            this.$store.dispatch("xmas/upgradeSlot", { tier: this.tier })
          );
        } else if (this.mode === "collect") {
          this.reset();
          this.handleHarvest();
        }
      }
    },
    async handleHarvest() {
      if (!this.tier6IsNotReady) {
        this.incomes.push({
          income: this.totalIncomeValueFormatted,
          id: this.incomeId++
        });
      }

      this.cycleStop(this.tier);

      await this.performRequestNoCatch(
        this.$store.dispatch("xmas/harvest", { tier: this.tier })
      );

      setTimeout(() => {
        this.incomes.splice(0, 1);
      }, 3000);
    },
    reset() {
      // console.log("Reset");
      this.progress = 0;
      this.localCurrencyIncomeValue = 0;
      this.localExpIncomeValue = 0;
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

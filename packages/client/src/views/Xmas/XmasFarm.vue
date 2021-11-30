<template>
  <div
    ref="farm"
    class="building font-size-25"
    :class="[!slot.level ? 'building-slot' : 'building-farm', slot.level ? 'building-mode-' + mode : null]"
    @click="handleClick"
  >
    <IncomeText v-for="income in incomes" :key="income.id">{{
      income.income
    }}</IncomeText>

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

    <template v-if="mode === 'manage'">
      <div v-if="this.tier >= 5">[Auto-cycle]</div>
      TIER: {{ tier }}<br />
      Level: {{ slot.level }}<br />
      <template v-if="!slot.level">
        Build price {{ upgradePriceFormatted }} SB
      </template>
      <template v-else> Upgrade price {{ upgradePriceFormatted }} SB</template>
    </template>

    <template v-if="mode === 'collect'">
      <div v-if="this.tier >= 5">[Auto-cycle]</div>
      TIER: {{ tier }}<br />

      <template v-if="slot.previousIncomeValue">
        Power: {{ previousCurrencyIncomeValueFormatted }}&nbsp;&rarr;&nbsp;<strong>{{
          currencyIncomeValueFormatted
        }}</strong
        ><br />
      </template>
      <template v-else> Power: {{ currencyIncomeValueFormatted }}<br /> </template>

      Accumulated: {{ totalCurrencyIncomeValueFormatted }} {{ slot.currency }}
    </template>
  </div>
</template>

<script>
import ProgressBar from "@/components/ProgressBar.vue";
import IncomeText from "./IncomeText.vue";
import PromptMixin from "@/components/PromptMixin.vue";
import { mapState } from "vuex";

import { abbreviateNumber } from "../../../../knightlands-shared/xmas";

export default {
  props: ["tier"],
  mixins: [PromptMixin],
  components: {
    IncomeText,
    ProgressBar
  },
  data: () => ({
    totalCurrencyIncomeValue: 0,
    totalExpIncomeValue: 0,
    progress: 0,
    animation: null,
    incomeId: 0,
    incomes: []
  }),
  watch: {
    "slot.level": function(value) {
      if (value === 1) {
        this.resetTimer();
      }
    }
  },
  computed: {
    slot() {
      return this.$store.getters["xmas/slot"](this.tier);
    },
    upgradePriceFormatted() {
      return abbreviateNumber(this.slot.upgradePrice);
    },
    currencyIncomeValueFormatted() {
      return abbreviateNumber(this.slot.incomeValue.currencyIncomePerCycle);
    },
    previousCurrencyIncomeValueFormatted() {
      return abbreviateNumber(this.slot.previousIncomeValue.currencyIncomePerCycle);
    },
    totalCurrencyIncomeValueFormatted() {
      return abbreviateNumber(this.totalCurrencyIncomeValue);
    },
    ...mapState({
      mode: state => state.xmas.mode
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
        let currentIncomeValue =
          this.slot.previousIncomeValue || this.slot.incomeValue;

        this.progress++;
        this.totalCurrencyIncomeValue += currentIncomeValue.currencyIncomePerCycle / 200;
        this.totalExpIncomeValue += currentIncomeValue.expIncomePerCycle / 200;

        // Add 50% of resources at the end
        if (this.progress >= 100) {
          this.totalCurrencyIncomeValue += currentIncomeValue.currencyIncomePerCycle / 2;
          this.totalExpIncomeValue += currentIncomeValue.expIncomePerCycle / 2;
          if (this.tier >= 5) {
            this.handleHarvest();
            this.$store.dispatch("xmas/resetIncomeValue", this.tier);
            this.resetTimer();
          } else {
            clearInterval(this.animation);
          }
        }
      }, this.slot.cycleLength);
    },
    async handleClick() {
      const level = this.slot.level;

      // Empty slot
      if (level === 0) {
        const result = await this.showPrompt(
          "Building a farm",
          `Are you sure you want to build a farm for ${this.slot.upgradePriceFormatted} ${this.slot.currency}?`,
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
        this.$store.dispatch("xmas/upgradeSlot", this.tier);

        // Existing farm
      } else {
        if (this.mode === "manage") {
          if (!this.slot.previousIncomeValue) {
            this.$store.dispatch("xmas/captureIncomeValue", this.tier);
          }
          this.$store.dispatch("xmas/upgradeSlot", this.tier);
        } else if (this.mode === "collect") {
          this.handleHarvest();
        }
      }
    },
    handleHarvest() {
      this.incomes.push({
        income: this.totalIncomeValueFormatted,
        id: this.incomeId++
      });
      this.$store.dispatch("xmas/addExpirience", this.totalExpIncomeValue);

      setTimeout(() => {
        this.incomes.splice(0, 1);
      }, 3000);

      this.resetTimer();
      this.progress = 0;
      this.totalCurrencyIncomeValue = 0;
      this.totalExpIncomeValue = 0;
      this.$store.dispatch("xmas/resetIncomeValue", this.tier);
    }
  }
};
</script>

<style lang="less" scoped>
.building {
  position: absolute;
  text-align: center;
  color: black;
}
.building-farm,
.building-slot {
  height: 17rem;
  width: 30rem;
  padding: 1rem 0;
}
.building-slot {
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
  top: -3rem;
}
</style>

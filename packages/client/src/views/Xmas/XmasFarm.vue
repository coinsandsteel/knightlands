<template>
  <div
    ref="farm"
    class="building font-size-25"
    :class="[!slot.level ? 'building-slot' : 'building-farm']"
    @click="handleClick"
  >
    <IncomeText v-for="income in incomes" :key="income.id">{{
      income.income
    }}</IncomeText>

    <progress-bar
      class="farm-progress-bar"
      v-if="slot.level && progress !== null"
      ref="progress"
      :maxValue="100"
      :percentMode="false"
      :hideMaxValue="false"
      v-model="progress"
      barType="green"
    ></progress-bar>

    <template v-if="mode === 'manage'">
      TIER: {{ tier }}<br />
      Level: {{ slot.level }}<br />
      <template v-if="!slot.level">
        Build price {{ slot.upgradePrice }}
      </template>
      <template v-else> Upgrade price {{ slot.upgradePrice }} </template>
    </template>

    <template v-if="mode === 'collect'">
      TIER: {{ tier }}<br />
      Collect: {{ totalCollectValueFormatted }}
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
    totalCollectValue: 0,
    progress: null,
    animation: null,
    incomeId: 0,
    incomes: []
  }),
  watch: {
    "slot.level": function(value) {
      if (value) {
        this.resetTimer();
      }
    }
  },
  computed: {
    slot() {
      return this.$store.getters["xmas/slot"](this.tier);
    },
    totalCollectValueFormatted() {
      return abbreviateNumber(this.totalCollectValue);
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
        this.progress++;
        this.totalCollectValue += this.slot.collectValue / 100;
        if (this.progress >= 100) {
          this.progress = 0;
        }
      }, this.tier * this.slot.level * 50);
    },
    async handleClick() {
      // Empty slot
      if (this.slot.level === 0) {
        const result = await this.showPrompt(
          "Building a farm",
          `Are you sure you want to build a farm for ${this.slot.upgradePrice} ${this.slot.currency}?`,
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
        if (result) {
          this.$store.dispatch("xmas/upgradeSlot", this.tier);
        }
      }

      if (this.mode === "manage") {
        this.$store.dispatch("xmas/upgradeSlot", this.tier);
      }

      if (this.mode === "collect" && this.slot.level > 0) {
        this.handleIncome();
      }
    },
    handleIncome() {
      this.incomes.push({
        income: this.totalCollectValueFormatted,
        id: this.incomeId++
      });

      setTimeout(() => {
        this.incomes.splice(0, 1);
      }, 3000);

      this.resetTimer();
      this.totalCollectValue = 0;
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
  height: 15rem;
  width: 30rem;
  padding: 1rem 0;
}
.building-slot {
  background: grey;
  opacity: 0.8;
}
.building-farm {
  background: aquamarine;
}
.farm-progress-bar {
  position: absolute;
  top: -3rem;
}
</style>

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
      barClasses="no-animation"
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

      <template v-if="slot.previousCollectValue">
        Power: {{ previousCollectValueFormatted }}&nbsp;&rarr;&nbsp;<strong>{{
          collectValueFormatted
        }}</strong
        ><br />
      </template>
      <template v-else> Power: {{ collectValueFormatted }}<br /> </template>

      Accumulated: {{ totalCollectValueFormatted }}
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
    collectValueFormatted() {
      return abbreviateNumber(this.slot.collectValue);
    },
    previousCollectValueFormatted() {
      return abbreviateNumber(this.slot.previousCollectValue);
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
        let currentCollectValue =
          this.slot.previousCollectValue || this.slot.collectValue;

        this.progress++;
        this.totalCollectValue += currentCollectValue / 200;

        // Add 50% of resources at the end
        if (this.progress >= 100) {
          this.totalCollectValue += currentCollectValue / 2;
          if (this.slot.tier > 5) {
            this.resetTimer();
          } else {
            clearInterval(this.animation);
          }
        }
      }, this.tier * 50);
    },
    async handleClick() {
      const level = this.slot.level;

      // Empty slot
      if (level === 0) {
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
        if (!result) {
          return;
        }
        this.$store.dispatch("xmas/upgradeSlot", this.tier);

        // Existing farm
      } else {
        if (this.mode === "manage") {
          if (!this.slot.previousCollectValue) {
            this.$store.dispatch("xmas/captureCollectValue", this.tier);
          }
          this.$store.dispatch("xmas/upgradeSlot", this.tier);
        } else if (this.mode === "collect") {
          this.handleHarvest();
        }
      }
    },
    handleHarvest() {
      this.incomes.push({
        income: this.totalCollectValueFormatted,
        id: this.incomeId++
      });

      setTimeout(() => {
        this.incomes.splice(0, 1);
      }, 3000);

      this.resetTimer();
      this.progress = 0;
      this.totalCollectValue = 0;
      this.$store.dispatch("xmas/resetCollectValue", this.tier);
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

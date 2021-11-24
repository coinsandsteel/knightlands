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
      Collect: {{ slot.collectValue }}
    </template>
  </div>
</template>

<script>
import IncomeText from "./IncomeText.vue";
import PromptMixin from "@/components/PromptMixin.vue";
import { mapState } from "vuex";

export default {
  props: ["tier"],
  mixins: [PromptMixin],
  components: {
    IncomeText
  },
  data: () => ({
    incomeId: 0,
    incomes: []
  }),
  computed: {
    slot() {
      return this.$store.getters["xmas/slot"](this.tier);
    },
    ...mapState({
      mode: state => state.xmas.mode
    })
  },
  beforeDestroy() {
    this.$app.$off("farm-blur");
  },
  methods: {
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
        this.handleIncome(this.slot.collectValue);
      }
    },
    handleIncome(income) {
      this.incomes.push({
        income: income,
        id: this.incomeId++
      });

      setTimeout(() => {
        this.incomes.splice(0, 1);
      }, 3000);
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
</style>

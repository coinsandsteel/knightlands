<template>
  <div
    ref="farm"
    class="building font-size-25"
    :class="[
      !slot.level ? 'building-slot' : 'building-farm',
      slot.level ? 'building-mode-' + mode : null
    ]"
  >
    <IncomeText v-for="income in incomes" :key="income.id">{{
      income.income
    }}</IncomeText>

    <div class="building-grid">
      <div class="row13 build-bg" v-if="!isBuilt"></div>

      <div
        class="row2"
        :class="{ row13: isBuilt }"
        :style="buildingImage"
      ></div>

      <div class="flex flex-items-center row1 flex-no-wrap">
        <div class="slot_common flex flex-center margin-right-half">
          <div :class="icon" class="big"></div>
        </div>

        <div
          class="label-bg font-size-18 flex flex-center height-100 margin-right-half"
          v-if="showDesc"
        >
          <span>{{ description }}</span>
        </div>
      </div>

      <CustomButton
        class="row3"
        type="green"
        v-if="showDesc"
        @click="handleClick"
      >
        Build
        <IconWithValue iconClass="icon-sb">{{ purchasePrice }}</IconWithValue>
      </CustomButton>

      <CustomButton
        class="row3"
        type="yellow"
        v-if="showUpgrade"
        @click="handleClick"
      >
        Upgrade
        <IconWithValue iconClass="icon-sb">{{ purchasePrice }}</IconWithValue>
      </CustomButton>

      <template v-if="mode === 'collect'">
        <progress-bar
          class="progress-bar row3"
          v-if="
            slot.level && progress !== null && localCurrencyIncomeValue <= 0
          "
          ref="progress"
          barClasses="no-animation"
          :maxValue="100"
          :percentMode="false"
          :hideMaxValue="false"
          v-model="progress"
          barType="green"
        ></progress-bar>

        <CustomButton class="row3" type="green" @click="handleClick" v-else>
          Collect
          <IconWithValue :iconClass="icon">{{
            localCurrencyIncomeValue
          }}</IconWithValue>
        </CustomButton>
      </template>
    </div>
  </div>
</template>

<script>
// import _ from "lodash";
import ProgressBar from "@/components/ProgressBar.vue";
import IncomeText from "./IncomeText.vue";
import PromptMixin from "@/components/PromptMixin.vue";
import NetworkRequestErrorMixin from "@/components/NetworkRequestErrorMixin.vue";
import { mapState } from "vuex";
import CustomButton from "@/components/Button.vue";
import IconWithValue from "@/components/IconWithValue.vue";

import {
  abbreviateNumber,
  CURRENCY_SANTABUCKS,
  CURRENCY_GOLD,
  CURRENCY_CHRISTMAS_POINTS,
  CURRENCY_UNIT_ESSENCE,
  CURRENCY_SHINIES,
  farmConfig
} from "../../../../knightlands-shared/xmas";

export default {
  props: ["tier"],
  mixins: [PromptMixin, NetworkRequestErrorMixin],
  components: {
    IncomeText,
    ProgressBar,
    CustomButton,
    IconWithValue
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
    purchasePrice() {
      return farmConfig[this.tier].baseBuildingPrice;
    },
    isBuilt() {
      return this.slot.level != 0;
    },
    showDesc() {
      return this.mode == "manage" && !this.isBuilt;
    },
    showUpgrade() {
      return this.mode == "manage" && this.isBuilt;
    },
    icon() {
      switch (farmConfig[this.tier].currency) {
        case CURRENCY_GOLD:
          return "icon-gold";
        case CURRENCY_SHINIES:
          return "icon-premium";
        case CURRENCY_SANTABUCKS:
          return "icon-sb";
        case CURRENCY_UNIT_ESSENCE:
          return "unit-essence";
        case CURRENCY_CHRISTMAS_POINTS:
          return "icon-cp";
      }

      return "";
    },
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
      levelGap: state => state.xmas.levelGap,
      balance: state => state.xmas.balance
    }),
    buildingImage() {
      return {
        "background-image": `url(/images/xmas/buildings/building${this.tier}.png)`,
        "background-size": "contain",
        "background-repeat": "no-repeat",
        "background-position": "center"
      };
    },
    description() {
      return "Produces Unit ESSENCES";
    }
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
      if (!this.isBuilt) {
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
// .building {
//   position: relative;
//   text-align: center;
//   color: black;
//   margin-bottom: 5rem;
// }
// .building-farm {
//   padding: 5rem 0;
// }
// .building-slot {
//   padding: 5rem 0;
//   background: grey;
//   opacity: 0.8;
// }
// .building-farm {
//   background: aquamarine;
//   &.building-mode-manage {
//     background: darkslateblue;
//     color: white;
//   }
//   &.building-mode-collect {
//     background: darkgreen;
//     color: white;
//   }
// }
// .progress-bar {
//   position: absolute;
//   bottom: 0;
// }

.building-grid {
  display: grid;
  grid-template-rows: 5rem 180fr 113fr;
  grid-template-columns: 1fr;
  margin-bottom: 1rem;
  justify-items: stretch;
  height: 20vh;

  & .row1 {
    grid-column: 1;
    grid-row: 1;
  }

  & .row2 {
    grid-column: 1;
    grid-row: 2;
  }

  & .row3 {
    grid-column: 1;
    grid-row: 3;
    align-self: flex-end;
  }

  & .row13 {
    grid-column: 1;
    grid-row: ~"1/4";
  }
}

.slot_common {
  display: flex !important;
  width: 5rem;
  height: 5rem;
}

.label-bg {
  border-image: url("../../assets/xmas/text_input_blue.png");
  border-image-slice: 27 27 27 27 fill;
  border-image-width: 14px;
  border-image-outset: 0px 0px 0px 0px;
  border-image-repeat: stretch stretch;
}

.build-bg {
  background-image: url("../../assets/xmas/buy_bg.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-position: center;
}
</style>

<style lang="less">
@import (reference) "../../style/common.less";
@import (reference) "../../style/sprites.less";

.unit-essence {
  .essence;
  .item-icon;
}
</style>

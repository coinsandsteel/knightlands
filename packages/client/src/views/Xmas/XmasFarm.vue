<template>
  <div
    ref="farm"
    class="building font-size-25 relative"
    :class="[
      !slot.level ? 'building-slot' : 'building-farm',
      slot.level ? 'building-mode-' + mode : null
    ]"
    @click.self="handleClick"
  >
    <IncomeText v-for="income in incomes" :key="income.id">{{
      income.income
    }}</IncomeText>

    <div class="building-grid">
      <div class="row13 build-bg" v-if="!isBuilt"></div>

      <div
        class="row2 flex flex-center"
        :class="[{ row13: isBuilt }, { na: !buildingIsAllowed }]"
        :style="buildingImage"
      >
        <span class="icon-lock-big huge" v-if="!buildingIsAllowed"></span>
      </div>

      <div class="flex flex-items-center row1 flex-no-wrap">
        <div class="icon-farm flex flex-center margin-right-half">
          <div :class="icon" class="big"></div>
        </div>

        <div
          class="label-bg font-size-18 flex flex-center padding-1 margin-right-half flex-self-center"
          v-if="showDesc"
        >
          <span>{{ description }}</span>
        </div>

        <div
          class="label-bg font-size-18 flex flex-center padding-1 flex-no-wrap flex-self-center"
          v-if="showUpgrade"
        >
          <span>{{ currentCurrencyIncomeValueFormatted }}</span>
          <span class="nav-arrow"></span>
          <span class="rarity-rare">{{
            nextCurrencyIncomeValueFormatted
          }}</span>
        </div>
      </div>

      <div
        class="row3 padding-bottom-1 font-weight-900"
        v-if="!buildingIsAllowed"
      >
        LOCKED
      </div>

      <CustomButton
        class="row3"
        type="green"
        v-else-if="showDesc"
        @click="handleClick"
      >
        Build
        <IconWithValue iconClass="icon-sb">{{
          upgradePriceFormatted
        }}</IconWithValue>
      </CustomButton>

      <CustomButton
        class="row3"
        type="yellow"
        :disabled="!canAffordUpgrade"
        v-else-if="showUpgrade"
        @click="handleClick"
      >
        Upgrade
        <IconWithValue iconClass="icon-sb">{{
          upgradePriceFormatted
        }}</IconWithValue>
      </CustomButton>

      <template v-if="mode === 'collect'">
        <ProgressWithLevel
          v-if="slot.level && progress !== null"
          :value="progress"
          :level="slot.level"
        ></ProgressWithLevel>

        <CustomButton class="row3" type="green" @click="handleClick">
          Collect
          <IconWithValue :iconClass="icon">{{
            localCurrencyIncomeValueFormatted
          }}</IconWithValue>
        </CustomButton>
      </template>
    </div>
  </div>
</template>

<script>
// import _ from "lodash";
import IncomeText from "./IncomeText.vue";
import PromptMixin from "@/components/PromptMixin.vue";
import NetworkRequestErrorMixin from "@/components/NetworkRequestErrorMixin.vue";
import { mapState } from "vuex";
import CustomButton from "@/components/Button.vue";
import IconWithValue from "@/components/IconWithValue.vue";
import ProgressWithLevel from "./ProgressWithLevel.vue";

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
    // ProgressWithLevel,
    IncomeText,
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
          // console.log("Launched watcher", this.tier, value);
          this.resetTimer(this.tier);
        }
      }
    },
    "slot.progress.percentage": {
      immediate: true,
      handler: function(value) {
        // console.log("Percentage watcher", this.tier, value);
        this.progress = value;
      }
    },
    "slot.accumulated.currency": {
      immediate: true,
      handler: function(value) {
        // console.log("Currency watcher", this.tier, value);
        this.localCurrencyIncomeValue = value;
      }
    },
    "slot.accumulated.exp": {
      immediate: true,
      handler: function(value) {
        // console.log("Exp watcher", this.tier, value);
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
      switch (this.tier) {
        case "1":
        case "5":
          return "Santabucks";

        case "2":
          return "Gold";

        case "3":
          return "Essence of Life";

        case "6":
          return "Shinies";
      }

      return "Xmas Points";
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
    async handleClick(e) {
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

.na {
  opacity: 0.6;
}

.label-bg {
  border-image: url("../../assets/xmas/text_input_blue.png");
  border-image-slice: 27 27 27 27 fill;
  border-image-width: 14px;
  border-image-outset: 0px 0px 0px 0px;
  border-image-repeat: stretch stretch;
}

.icon-farm {
  background-image: url("../../assets/ui/spritesheet/slot_common.png");
  background-size: contain;
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

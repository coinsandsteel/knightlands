<template>
  <div class="tab-content">
    <div class="flex flex-column attributes flex-no-wrap">
      <numeric-value
        v-for="att in Attributes"
        :key="att"
        class="att-row"
        :showMax="true"
        :value="getStatValue(att)"
        :maxValue="getMaxStatValue(att)"
        :caption="att"
        :decreaseCondition="(getEditedAttribute(att) > 0 && attributesNeedReset)"
        :increaseCondition="hasEnoughGold(att) && getAttributeValue(att) < getMaxStat(att)"
        @inc="increaseAttribute(att)"
        @dec="decreaseAttribute(att)"
      >
        <div class="flex flex-items-center" style="width: 30%">
          <span class="icon-gold"></span>
          <span>{{getUpgradePrice(att)}}</span>
        </div>
      </numeric-value>

      <div
        v-show="attributesNeedReset"
        class="flex flex-center flex-full margin-top-3 flex-space-around"
      >
        <custom-button type="green" @click="confirmAttributes">Apply</custom-button>
        <custom-button @click="resetAttributes">Reset</custom-button>
      </div>
    </div>
  </div>
</template>

<script>
import Prompt from "@/components/Prompt.vue";
import UpgradableCharacterStats from "@/../knightlands-shared/upgradable_character_stats";
import { create as CreateDialog } from "vue-modal-dialogs";
import { setTimeout, clearTimeout, clearInterval, setInterval } from "timers";
import CustomButton from "@/components/Button.vue";
import TrainingCamp from "@/../knightlands-shared/training_camp";
import { StatConversions } from "@/../knightlands-shared/character_stat.js";
import NumericValue from "@/components/NumericValue.vue";
const ContinuousEditingTimeout = 500;
const ShowPrompt = CreateDialog(Prompt, ...Prompt.props);

export default {
  components: { CustomButton, NumericValue },
  data: () => ({
    Attributes: UpgradableCharacterStats,
    longPressAttributeModificationTimeout: undefined,
    attributeModificationInterval: undefined,
    purchasedAttributes: {},
    upgradePrice: {}
  }),
  created() {
    for (let stat in UpgradableCharacterStats) {
      this.$set(this.upgradePrice, UpgradableCharacterStats[stat], 0);
      this.$set(this.purchasedAttributes, UpgradableCharacterStats[stat], 0);
    }
  },
  deactivated() {
    this.resetAttributes();
  },
  computed: {
    attributesNeedReset() {
      for (let i in this.purchasedAttributes) {
        if (this.purchasedAttributes[i] !== 0) {
          return true;
        }
      }
      return false;
    }
  },
  methods: {
    getAttributeValue(stat) {
      return (
        this.$character.getAttribute(stat) + this.purchasedAttributes[stat]
      );
    },
    getStatValue(stat) {
      return this.getAttributeValue(stat) * StatConversions[stat];
    },
    getMaxStat(stat) {
      return TrainingCamp.getMaxStat(this.$character.level);
    },
    getMaxStatValue(stat) {
      return (
        TrainingCamp.getMaxStat(this.$character.level) * StatConversions[stat]
      );
    },
    hasEnoughGold(stat) {
      return this.getUpgradePrice(stat) <= this.$game.softCurrency;
    },
    getUpgradePrice(stat) {
      return TrainingCamp.getStatCost(stat, this.getAttributeValue(stat));
    },
    canDecrease(attr) {
      return (
        this.$character.getAttribute(attr) > this.purchasedAttributes[attr]
      );
    },
    getEditedAttribute(attr) {
      return this.purchasedAttributes[attr];
    },
    resetAttributes() {
      for (let i in this.purchasedAttributes) {
        this.purchasedAttributes[i] = 0;
        this.$game.softCurrency += this.upgradePrice[i];
        this.upgradePrice[i] = 0;
      }
    },
    increaseAttribute(attr) {
      let upgradePrice = this.getUpgradePrice(attr);
      this.upgradePrice[attr] += upgradePrice;
      this.$game.softCurrency -= upgradePrice;
      this.purchasedAttributes[attr]++;
      return true;
    },
    decreaseAttribute(attr) {
      this.purchasedAttributes[attr]--;
      let upgradePrice = this.getUpgradePrice(attr);
      this.upgradePrice[attr] -= upgradePrice;
      this.$game.softCurrency += upgradePrice;

      return true;
    },
    async confirmAttributes() {
      let totalGold = 0;
      for (let i in this.upgradePrice) {
        totalGold += this.upgradePrice[i];
      }

      let result = await ShowPrompt(
        `Are you sure?`,
        `Total gold spend is ${totalGold}`,
        [
          { type: "green", title: "Ok", response: true },
          { type: "red", title: "Cancel", response: false }
        ]
      );

      if (!result) {
        return;
      }

      await this.$game.buyStats(this.purchasedAttributes);

      for (let i in this.purchasedAttributes) {
        this.purchasedAttributes[i] = 0;
        this.upgradePrice[i] = 0;
      }
    }
  }
};
</script>
<style lang="less" scoped>

.confirm-stats {
  width: 60%;
  justify-content: space-between;
  align-items: center;

  .confirm-message {
    width: 100%;
    margin-bottom: 20px;
  }
}

.footer {
  margin-top: 20px;
}

.attributes-container {
  margin-top: 20px;
}

.att-name {
  width: 20%;
  text-align: right;
}

.att-value {
  width: 30%;
  text-align: right;
}

.disabled-btn {
  opacity: 0.3;
  pointer-events: none;
}

.att-btn(@filename) {
  background-image: url("../../assets/ui/@{filename}.png");
  background-size: contain;
  background-repeat: no-repeat;
  width: 2rem;
  height: 2rem;
}

.att-plus {
  .att-btn("button_plus_training_camp");
}

.att-minus {
  .att-btn("button_minus_training_camp");
}
</style>;

<template>
  <div class="tab-content" v-bar>
    <div class="flex flex-column attributes flex-no-wrap">
      <div
        class="flex flex-center flex-no-wrap att-row width-100"
        v-for="att in Attributes"
        :key="att"
      >
        <div class="flex-1 flex flex-center margin-right-4">
          <CraftingIngridient
            :ingridient="getResource(att)"
            :noLocking="true"
          ></CraftingIngridient>
        </div>
        <div class="flex flex-column flex-items-start flex-4 margin-right-2">
          <div class="flex width-100 flex-space-between margin-bottom-1">
            <span class="font-size-22 margin-right-1">{{ $t(att) }}</span>
            <IconWithValue
              class="margin-bottom-1"
              iconClass="icon-gold"
              :flip="true"
              >{{ getUpgradePrice(att) }}</IconWithValue
            >
          </div>
          <numeric-value
            class="width-100"
            :id="`num-${att}`"
            :showMax="true"
            :value="getStatValue(att)"
            :maxValue="getMaxStatValue(att)"
            :decreaseCondition="canDecrease(att)"
            :increaseCondition="canIncrease(att)"
            @inc="increaseAttribute(att)"
            @dec="decreaseAttribute(att)"
            @max="setMax(att)"
            @reset="reset(att)"
          ></numeric-value>
        </div>
      </div>

      <!-- <div class="flex flex-center color-panel-2">
        <div class="flex flex-no-wrap flex-item-center">
          <span class="icon-gold margin-right-half"></span>
          <span class="status-bar-font font-size-20">{{
            $game.softCurrency
          }}</span>
        </div>
      </div> -->

      <div
        v-show="attributesNeedReset"
        class="flex flex-center flex-full margin-top-3 flex-space-around margin-bottom-3"
      >
        <custom-button type="green" @click="confirmAttributes" id="apply-btn">{{
          $t("btn-apply")
        }}</custom-button>
        <custom-button @click="resetAttributes">{{
          $t("btn-reset")
        }}</custom-button>
      </div>
    </div>
  </div>
</template>

<script>
import UpgradableCharacterStats from "@/../../knightlands-shared/upgradable_character_stats";
import CustomButton from "@/components/Button.vue";
import TrainingCamp from "@/../../knightlands-shared/training_camp";
import { StatConversions } from "@/../../knightlands-shared/character_stat.js";
import NumericValue from "@/components/NumericValue.vue";
import CraftingIngridient from "@/components/CraftingIngridient.vue";
import TrainingCampMeta from "@/metadata/training_camp";
import IconWithValue from "@/components/IconWithValue.vue";
import NetworkRequestErrorMixin from "@/components/NetworkRequestErrorMixin.vue";

export default {
  mixins: [NetworkRequestErrorMixin],
  components: { CustomButton, NumericValue, CraftingIngridient, IconWithValue },
  data: () => ({
    Attributes: UpgradableCharacterStats,
    longPressAttributeModificationTimeout: undefined,
    attributeModificationInterval: undefined,
    purchasedAttributes: {},
    upgradePrice: {},
    upgradeResources: {}
  }),
  created() {
    this.resourceItems = {};
  },
  activated() {
    this.init();
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
    canIncrease(att) {
      return (
        this.hasEnoughGold(att) &&
        this.getAttributeValue(att) < this.getMaxStat(att) &&
        this.hasEnoughResource(att)
      );
    },
    init() {
      for (let statKey in UpgradableCharacterStats) {
        const stat = UpgradableCharacterStats[statKey];

        this.$set(this.upgradePrice, stat, 0);
        this.$set(this.purchasedAttributes, stat, 0);
        this.$set(this.upgradeResources, stat, 0);
        this.resourceItems[stat] = this.$game.inventory.getItemByTemplate(
          TrainingCampMeta.find(x => x.stat == stat).resource
        );
      }
    },
    getResource(stat) {
      return {
        itemId: TrainingCampMeta.find(x => x.stat == stat).resource,
        quantity:
          TrainingCamp.getStatResourceCost(stat, this.getAttributeValue(stat)) +
          this.upgradeResources[stat]
      };
    },
    getAttributeValue(stat) {
      return (
        this.$character.getAttribute(stat) +
        (this.purchasedAttributes[stat] || 0)
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
    hasEnoughResource(stat) {
      const res = this.getResource(stat);

      return (
        this.resourceItems[stat] &&
        this.resourceItems[stat].count >= res.quantity
      );
    },
    getUpgradePrice(stat) {
      return TrainingCamp.getStatCost(stat, this.getAttributeValue(stat));
    },
    canDecrease(att) {
      return this.getEditedAttribute(att) > 0 && this.attributesNeedReset;
    },
    getEditedAttribute(attr) {
      return this.purchasedAttributes[attr];
    },
    resetAttributes() {
      for (let i in this.purchasedAttributes) {
        this.purchasedAttributes[i] = 0;
        this.$game.softCurrency += this.upgradePrice[i];
        this.upgradePrice[i] = 0;
        this.upgradeResources[i] = 0;
      }
    },
    setMax(att) {
      while (this.canIncrease(att)) {
        this.increaseAttribute(att);
      }
    },
    reset(attr) {
      while (this.canDecrease(attr)) {
        this.decreaseAttribute(attr);
      }
    },
    increaseAttribute(attr) {
      let upgradePrice = this.getUpgradePrice(attr);
      this.upgradePrice[attr] += upgradePrice;
      this.$game.softCurrency -= upgradePrice;

      const resUpgradePrice = TrainingCamp.getStatResourceCost(
        attr,
        this.getAttributeValue(attr)
      );
      this.upgradeResources[attr] += resUpgradePrice;
      this.purchasedAttributes[attr]++;

      return true;
    },
    decreaseAttribute(attr) {
      this.purchasedAttributes[attr]--;

      const upgradePrice = this.getUpgradePrice(attr);
      this.upgradePrice[attr] -= upgradePrice;
      this.$game.softCurrency += upgradePrice;

      const resUpgradePrice = TrainingCamp.getStatResourceCost(
        attr,
        this.getAttributeValue(attr)
      );
      this.upgradeResources[attr] -= resUpgradePrice;

      return true;
    },
    async confirmAttributes() {
      await this.performRequest(this.$game.buyStats(this.purchasedAttributes));
      await this.$game.notifications.updateTraining();
      this.init();
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
}</style
>;

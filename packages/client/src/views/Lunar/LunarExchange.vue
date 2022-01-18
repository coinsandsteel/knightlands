<template>
  <div class="screen-content">
    <div class="full-flex dummy-height width-100">
      <div
        class="width-100 height-100 dummy-height flex flex-column flex-no-wrap"
      >
        <ExchangeContainer
          :maxSelectedItems="
            selectedRarity ? selectedRarity.exchangeItemsCount : 0
          "
          :selectedItems="selectedItems"
          :hasExchanged="hasExchanged"
          :isExchanging="isExchanging"
          :selectedRarityId="selectedRarityId"
          :class="
            selectedRarityId ? `exchange-container--${selectedRarityId}` : null
          "
          @item-removed="itemRemovedHandler"
          @reset-requested="itemsResetHandler"
          @exchange-requested="exchangeHandler"
        />
        <div class="inv-root dummy-height full-flex width-100 height-100">
          <div v-bar class="center width-100 height-100 dummy-height">
            <div>
              <template v-for="(rarity, rarityIndex) in itemRaritys">
                <div
                  class="rarity-name font-size-25 text-align-left padding-top-1 padding-bottom-1 padding-left-2 padding-right-2"
                  :key="`rarity-name-${rarityIndex}`"
                  :class="rarity.class"
                >
                  {{ rarity.name }}
                </div>
                <div
                  :key="`rarity-${rarityIndex}`"
                  class="element-rarity width-100 dummy-height inventory-container margin-top-1 margin-bottom-1  padding-left-1 padding-right-1"
                >
                  <Loot
                    v-for="(item, itemIndex) in rarity.items"
                    :id="`i-${item.template}`"
                    :item="item"
                    :key="itemIndex"
                    :inventory="false"
                    :itemSlotClasses="
                      item && item.itemSlotClasses ? item.itemSlotClasses : null
                    "
                    :iconClasses="
                      item && item.iconClasses ? item.iconClasses : null
                    "
                    :class="{
                      'opacity-50':
                        selectedRarityId && item.rarity !== selectedRarityId
                    }"
                    @hint="handleHint"
                  />
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- levels switcher -->
    <portal v-if="isActive" to="footer" :slim="true">
      <LunarElementRaritiesSwitcher
        isExpertRarityVisible
        @rarity-updated="rarityUpdatedHandler"
      />
    </portal>
  </div>
</template>
<script>
import NetworkRequestErrorMixin from "@/components/NetworkRequestErrorMixin.vue";
import ExchangeContainer from "@/views/Lunar/ExchangeContainer.vue";
import LunarElementRaritiesSwitcher from "@/views/Lunar/LunarElementRaritiesSwitcher.vue";
import ActivityMixin from "@/components/ActivityMixin.vue";
import Loot from "@/components/Loot.vue";
import {
  ITEM_RARITY_BASIC,
  ITEM_RARITY_ADVANCED,
  ITEM_RARITY_EXPERT
} from "@/../../knightlands-shared/lunar";

export default {
  components: {
    ExchangeContainer,
    Loot,
    LunarElementRaritiesSwitcher
  },
  mixins: [ActivityMixin, NetworkRequestErrorMixin],
  data() {
    return {
      selectedItems: [],
      lootClasses: [],
      selected: {},
      selectedItemId: null,
      maxSelectedItems: 3,
      selectedRarityId: null,
      hasExchanged: false
      /* DEMO items structure
      items: [
        {
          id: 1,
          template: 100,
          rarity: "common"
          caption: "l111",
          quantity: 2
        }
      ]*/
    };
  },
  computed: {
    items() {
      let items = this.$game.inventory.items;
      let i = 0;
      const length = items.length;
      let filteredItems = [];
      let rarityClassMap = {
        common: "rarity-basic-name",
        rare: "rarity-advanced-name",
        epic: "rarity-expert-name"
      };
      for (; i < length; ++i) {
        const item = items[i];
        if (item.template >= 3214) {
          let rarity = this.$game.itemsDB.getRarity(item.template);
          filteredItems.push({
            ...item,
            rarity,
            iconClasses: rarityClassMap[rarity],
            itemSlotClasses: "lunar-lantern-slot",
            isCustomElement: true
          });
        }
      }
      return filteredItems;
    },

    itemRaritys() {
      const raritys = [
        {
          id: ITEM_RARITY_BASIC,
          name: this.$t("basic-elements"),
          items: this.items.filter(item => item.rarity === ITEM_RARITY_BASIC),
          exchangeItemsCount: 2,
          class: "rarity-basic-name"
        },
        {
          id: ITEM_RARITY_ADVANCED,
          name: this.$t("advanced-elements"),
          items: this.items.filter(
            item => item.rarity === ITEM_RARITY_ADVANCED
          ),
          exchangeItemsCount: 2,
          class: "rarity-advanced-name"
        },
        {
          id: ITEM_RARITY_EXPERT,
          name: this.$t("expert-elements"),
          items: this.items.filter(item => item.rarity === ITEM_RARITY_EXPERT),
          exchangeItemsCount: 2,
          class: "rarity-expert-name"
        }
      ];

      return raritys;
    },

    selectedItemIds() {
      return this.selectedItems.map(({ id }) => id);
    },

    selectedRarity() {
      if (!this.selectedRarityId) {
        return null;
      }

      return this.itemRaritys.find(({ id }) => id === this.selectedRarityId);
    },

    isExchanging() {
      return this.selectedItemIds.length > 0;
    }

    // nextLevel() {
    //   switch (this.selectedRarityId) {
    //     case GROUP.BASIC:
    //       return GROUP.ADVANCED;
    //     case GROUP.ADVANCED:
    //       return GROUP.EXPERT;
    //     case GROUP.EXPERT:
    //       return "nft";

    //     default:
    //       return null;
    //   }
    // }
  },
  methods: {
    handleHint(item) {
      if (this.selectedRarityId && item.rarity !== this.selectedRarityId) {
        return;
      }
      // if (this.selectedItems.length <= 0) {
      //   this.selectedRarityId = item.rarity;
      // }
      const index = this.selectedItems.findIndex(({ id }) => id === item.id);
      // if (index >= 0) {
      //   this.selectedItems.splice(index, 1);
      //   this.selectedItemId = null;
      // } else if (this.selectedItems.length < this.maxSelectedItems) {
      //   this.selectedItems.push(item);
      //   this.selectedItemId = item.id;
      // } else {
      //   this.selectedItemId = null;
      // }
      if (
        index < 0 &&
        (!this.selectedRarity ||
          (this.selectedRarity &&
            this.selectedItems.length < this.selectedRarity.exchangeItemsCount))
      ) {
        this.selectedItems.push(item);
        this.selectedItemId = item.id;
        this.selectedRarityId = item.rarity;
        return;
      }
      this.selectedItemId = null;
    },

    itemRemovedHandler(item) {
      const index = this.selectedItems.findIndex(({ id }) => id === item.id);
      this.selectedItems.splice(index, 1);
      this.selectedItemId = null;
      if (this.selectedItems.length <= 0) {
        this.selectedRarityId = null;
      }
    },

    itemsResetHandler() {
      this.selectedItems = [];
      this.selectedItemId = null;
      this.selectedRarityId = null;
      this.hasExchanged = false;
    },

    rarityUpdatedHandler(rarity) {
      if (this.selectedRarityId === rarity) {
        return;
      }
      this.itemsResetHandler();
      this.selectedRarityId = rarity;
    },

    async exchangeHandler() {
      if (this.hasExchanged) {
        return;
      }

      await this.performRequestNoCatch(
        this.$store.dispatch("lunar/exchange", this.selectedItems)
      );

      this.hasExchanged = true;
    }
  }
};
</script>
<style scoped lang="less">
.v-bar-fix {
  & > div {
    overflow: auto !important;
  }
}
.element-rarity {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(8rem, 1fr));
  justify-items: center;
  grid-gap: 2rem;
}
.rarity-name {
  background: rgba(0, 0, 0, 0.5);
}
.rarity-rare-name {
  color: #09fa08;
}
.rarity-epic-name {
  color: #fe55ff;
}
</style>

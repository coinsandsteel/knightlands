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
          :hasExchanged="hasExchanged && !!exchangedItem"
          :isExchanging="isExchanging"
          :selectedRarityId="selectedRarityId"
          :exchangedItem="exchangedItem"
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
                  >
                  </Loot>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- levels switcher -->
    <portal v-if="false && isActive" to="footer" :slim="true">
      <LunarElementRaritiesSwitcher
        isExpertRarityVisible
        @rarity-updated="rarityUpdatedHandler"
      />
    </portal>
  </div>
</template>
<script>
import { mapState } from "vuex";
import { getLanternIcon } from "@/helpers/utils";
import NetworkRequestErrorMixin from "@/components/NetworkRequestErrorMixin.vue";
import ExchangeContainer from "@/views/Lunar/ExchangeContainer.vue";
import LunarElementRaritiesSwitcher from "@/views/Lunar/LunarElementRaritiesSwitcher.vue";
import ActivityMixin from "@/components/ActivityMixin.vue";
import Loot from "@/components/Loot.vue";
import {
  ITEM_RARITY_BASIC,
  ITEM_RARITY_ADVANCED,
  ITEM_RARITY_EXPERT,
  RARITY_CLASS_MAP
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
    };
  },
  computed: {
    ...mapState("lunar", ["newItem"]),
    exchangedItem() {
      if (!this.newItem) {
        return null;
      }

      const rarity = this.$game.itemsDB.getRarity(this.newItem.template);
      const info = this.$game.itemsDB.getTemplate(this.newItem.template);
      const icon = info.icon || getLanternIcon(info.id);

      return {
        id: this.newItem._id,
        info,
        rarity: rarity,
        caption: this.newItem.caption,
        template: this.newItem.template,
        iconClasses: `${RARITY_CLASS_MAP[this.newItem.rarity]} ${icon}`,
        itemSlotClasses: "lunar-lantern-slot",
        isCustomElement: true
      };
    },
    items() {
      let items = this.$game.inventory.items.filter(({ template }) => {
        const info = this.$game.itemsDB.getTemplate(template);
        return info.type === "lunarResource";
      });
      let i = 0;
      const length = items.length;
      let filteredItems = [];
      for (; i < length; ++i) {
        const item = items[i];
        const rarity = this.$game.itemsDB.getRarity(item.template);
        const info = this.$game.itemsDB.getTemplate(item.template);
        const icon = info.icon || getLanternIcon(info.id);
        const newItem = {
          ...item,
          info,
          rarity,
          iconClasses: `${RARITY_CLASS_MAP[rarity]} ${icon}`,
          itemSlotClasses: "lunar-lantern-slot",
          isCustomElement: true
        };
        if (rarity === ITEM_RARITY_EXPERT) {
          if (newItem.count > 1) {
            newItem.count = newItem.count - 1;
            filteredItems.push(newItem);
          } else {
            continue;
          }
        } else {
          filteredItems.push(newItem);
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
  },

  watch: {
    newItem(value) {
      if (value) {
        this.hasExchanged = true;
      }
    }
  },

  methods: {
    handleHint(item) {
      if (this.selectedRarityId && item.rarity !== this.selectedRarityId) {
        return;
      }

      const selectedItemsWithSameId = this.selectedItems.filter(
        ({ template }) => template === item.template
      );

      if (
        selectedItemsWithSameId.length < item.count &&
        (!this.selectedRarity ||
          (this.selectedRarity &&
            this.selectedItems.length < this.selectedRarity.exchangeItemsCount))
      ) {
        this.selectedItems.push(item);
        this.selectedItemId = item.template;
        this.selectedRarityId = item.rarity;
        return;
      }
      this.selectedItemId = null;
    },

    itemRemovedHandler(item) {
      const index = this.selectedItems.findIndex(
        ({ template }) => template === item.template
      );
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
      this.$store.commit("lunar/updateState", { newItem: null });
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

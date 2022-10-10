<template>
  <div class="screen-content">
    <CraftingItemList
      ref="itemList"
      :items="items"
      :hintHandler="handleHint"
      :equippedItemsFilter="equippedItemsFilter"
      :filtersStore="$store.getters.getEnchantFilters"
      commitCmd="setEnchantingFilters"
    >
      <template #default>
        <span class="font-size-20">{{ $t("enchant-list-empty-msg") }}</span>
      </template>

      <template #footer>
        <portal to="footer" v-if="isActive">
          <HintButton
            title="i-enchant"
            :texts="['i-enchant-1', 'i-enchant-2']"
          ></HintButton>
        </portal>
      </template>
    </CraftingItemList>

    <ScrollableItemHint
      ref="scrollHint"
      :items="filteredItems"
      :showButtons="false"
      :noComparison="true"
      @action="handleEquipmentAction"
      :getHintButtons="getHintButtons"
    ></ScrollableItemHint>
  </div>
</template>

<script>
import AppSection from "@/AppSection.vue";
import CraftingItemList from "../CraftingItemList.vue";
const { ItemType } = require("@/../../knightlands-shared/item_type");
import ScrollableItemHint from "@/components/Item/ScrollableItemHint.vue";
import HintButton from "@/components/HintButton.vue";

export default {
  mixins: [AppSection],
  components: { CraftingItemList, ScrollableItemHint, HintButton },
  data: () => ({
    filteredItems: []
  }),
  created() {
    this.title = "window-enchant-items-list";
  },
  computed: {
    items() {
      const filteredItems = [];
      const filteredIds = {};
      const maxEnchant = this.$game.itemsDB.getMaxEnchantingLevel();

      // place equipment items first
      for (let slot in this.$game.character.equipment) {
        const gear = this.$game.character.equipment[slot];
        const template = this.$game.itemsDB.getTemplate(gear.template);

        if (!template.enchantable || gear.enchant >= maxEnchant) {
          continue;
        }

        filteredIds[gear.id] = true;
        filteredItems.push(gear);
      }

      let items = this.$game.inventory.items;
      let i = 0;
      const length = items.length;
      for (; i < length; ++i) {
        const item = items[i];
        const template = this.$game.itemsDB.getTemplate(item.template);

        if (template.type != ItemType.Equipment) {
          continue;
        }

        if (
          !template.enchantable ||
          item.enchant >= maxEnchant ||
          filteredIds[item.id]
        ) {
          continue;
        }

        filteredItems.push(item);
      }

      return filteredItems;
    }
  },
  methods: {
    equippedItemsFilter(item) {
      return (item.enchant || 0) < 15;
    },
    handleHint(item, index, filteredItems) {
      this.filteredItems = filteredItems;
      this.$nextTick(() => {
        this.$refs.scrollHint.showHint(index);
      });
    },
    handleEquipmentAction(item, action) {
      if (action === true) {
        this.$router.push({
          name: "enchant-item",
          params: { itemId: item.id }
        });
      }
    },
    getHintButtons() {
      return [
        {
          title: "btn-enchant",
          response: true,
          type: "grey"
        }
      ];
    }
  }
};
</script>

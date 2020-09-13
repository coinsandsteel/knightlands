<template>
  <div class="screen-content">
    <CraftingItemList
      :items="items"
      :hintHandler="openEnchant"
      :equippedItemsFilter="equippedItemsFilter"
      :filtersStore="$store.getters.getEnchantFilters"
      commitCmd="setEnchantingFilters"
    >
      <span class="font-size-20">{{ $t("enchant-list-empty-msg") }}</span>
    </CraftingItemList>
  </div>
</template>

<script>
import AppSection from "@/AppSection.vue";
import CraftingItemList from "../CraftingItemList.vue";
const ItemType = require("@/../../knightlands-shared/item_type");

export default {
  mixins: [AppSection],
  components: { CraftingItemList },
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
      return true;
    },
    openEnchant(item) {
      this.$router.push({ name: "enchant-item", params: { itemId: item.id } });
    }
  }
};
</script>

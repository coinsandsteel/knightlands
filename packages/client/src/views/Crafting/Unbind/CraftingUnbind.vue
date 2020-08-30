<template>
  <CraftingItemList
    :items="items"
    :hintHandler="openUnbind"
    :equippedItemsFilter="equippedItemsFilter"
    :filtersStore="$store.getters.getUnbindFilters"
    commitCmd="setUnbindFilters"
  >
    <span class="font-size-20">{{ $t("upgrade-list-empty-msg") }}</span>
  </CraftingItemList>
</template>

<script>
import AppSection from "@/AppSection.vue";
import CraftingItemList from "../CraftingItemList.vue";

export default {
  mixins: [AppSection],
  components: { CraftingItemList },
  created() {
    this.title = "window-unbind-items-list";
  },
  computed: {
    items() {
      const filteredItems = [];

      let items = this.$game.inventory.items;
      let i = 0;
      const length = items.length;

      for (; i < length; ++i) {
        const item = items[i];
        const template = this.$game.itemsDB.getTemplate(item.template);

        if (!template.unbindable || item.breakLimit == 2 || item.equipped) {
          continue;
        }

        if (this.$game.inventory.getItemsCountByTemplate(item.template) < 2) {
          continue;
        }

        filteredItems.push(item);
      }

      return filteredItems;
    }
  },
  methods: {
    openUnbind(item) {
      this.$router.push({ name: "unbind-item", params: { itemId: item.id } });
    },
    equippedItemsFilter(item, template) {
      return item.breakLimit != 2 && !template.unbindable;
    }
  }
};
</script>

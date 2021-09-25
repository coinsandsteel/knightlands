<template>
  <CraftingItemList
    :items="items"
    :hintHandler="openUnbind"
    :equippedItemsFilter="equippedItemsFilter"
    :filtersStore="$store.getters.getUnbindFilters"
    commitCmd="setUnbindFilters"
  >
    <template #default>
      <span class="font-size-20">{{ $t("upgrade-list-empty-msg") }}</span>
    </template>

    <template #footer>
      <portal to="footer" v-if="isActive">
        <HintButton
          title="i-unbind"
          :texts="['i-unbind-1', 'i-unbind-2', 'i-unbind-3']"
        ></HintButton>
      </portal>
    </template>
  </CraftingItemList>
</template>

<script>
import AppSection from "@/AppSection.vue";
import CraftingItemList from "../CraftingItemList.vue";
import HintButton from "@/components/HintButton.vue";

export default {
  mixins: [AppSection],
  components: { CraftingItemList, HintButton },
  created() {
    this.title = "window-unbind-items-list";
    this.$options.useRouterBack = true;
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

        if (!template.unbindable || item.breakLimit == 2 || item.locked) {
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
      return item.breakLimit != 2 && template.unbindable;
    }
  }
};
</script>

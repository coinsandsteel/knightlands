<template>
  <CraftingItemList
    :items="items"
    :hintHandler="openUpgrade"
    :equippedItemsFilter="equippedItemsFilter"
    :filtersStore="$store.getters.getLevelUpFilters"
    commitCmd="setLevelUpFilters"
  >
    <template #default>
      <span class="font-size-20">{{ $t("leveling-list-empty-msg") }}</span>
    </template>

    <template #footer>
      <portal to="footer" v-if="isActive">
        <HintButton
          title="i-lvlup"
          :texts="['i-lvlup-1', 'i-lvlup-2']"
        ></HintButton>
      </portal>
    </template>
  </CraftingItemList>
</template>

<script>
import CraftingItemList from "../CraftingItemList.vue";
import AppSection from "@/AppSection.vue";
const ItemType = require("@/../../knightlands-shared/item_type");
import HintButton from "@/components/HintButton.vue";

export default {
  mixins: [AppSection],
  components: { CraftingItemList, HintButton },
  created() {
    this.title = "window-upgrade-items-list";
    this.$options.useRouterBack = true;
  },
  computed: {
    items() {
      const upgradableSlots = this.$game.itemsDB.getUpgradableSlots();
      const filteredItems = [];
      const filteredIds = {};

      const items = this.$game.inventory.items;
      let i = 0;
      const length = items.length;

      for (; i < length; ++i) {
        let item = items[i];
        let template = this.$game.itemsDB.getTemplate(item.template);

        if (
          template.type != ItemType.Equipment ||
          !upgradableSlots[this.$game.itemsDB.getSlot(item.template)] ||
          filteredIds[item.id] ||
          item.equipped
        ) {
          continue;
        }

        if (item.level < this.$game.itemsDB.getMaxLevel(item)) {
          filteredItems.push(item);
        }
      }

      return filteredItems;
    }
  },
  methods: {
    equippedItemsFilter(item) {
      return item.level < this.$game.itemsDB.getMaxLevel(item);
    },
    openUpgrade(item) {
      this.$router.push({ name: "upgrade-item", params: { itemId: item.id } });
    }
  }
};
</script>

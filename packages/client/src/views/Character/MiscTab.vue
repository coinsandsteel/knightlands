<template>
  <div class="tab-content dummy-height flex flex-column full-flex">
    <Inventory
      class="width-100"
      commitCmd="setMiscFilters"
      :items="consumables"
      :filtersStore="$store.getters.getMiscFilters"
      :hideFilters="true"
      :hideFooter="true"
    ></Inventory>

    <Inventory
      class="width-100"
      :class="{ 'margin-top-2': consumables.length > 0 }"
      commitCmd="setMiscFilters"
      :items="other"
      :filtersStore="$store.getters.getMiscFilters"
    ></Inventory>
  </div>
</template>

<script>
import Inventory from "./Inventory.vue";
const ItemActions = require("@/../../knightlands-shared/item_actions");

export default {
  components: {
    Inventory
  },
  computed: {
    nonEquipment() {
      let items = this.$game.inventory.items;
      let i = 0;
      const length = items.length;
      let filteredItems = [];
      for (; i < length; ++i) {
        const item = items[i];
        if (!item.rarity) {
          filteredItems.push(item);
        }
      }

      return filteredItems;
    },
    consumables() {
      let nonEquipment = this.nonEquipment;

      let i = 0;
      const length = nonEquipment.length;
      let filteredItems = [];

      for (; i < length; ++i) {
        const item = nonEquipment[i];
        const template = this.$game.itemsDB.getTemplate(item.template);

        if (!template.action) {
          continue;
        }

        if (
          template.action.action != ItemActions.Buff &&
          template.action.action != ItemActions.RaidBuff
        ) {
          filteredItems.push(item);
        }
      }

      return filteredItems;
    },
    other() {
      let nonEquipment = this.nonEquipment;

      let i = 0;
      const length = nonEquipment.length;
      let filteredItems = [];

      for (; i < length; ++i) {
        const item = nonEquipment[i];
        const template = this.$game.itemsDB.getTemplate(item.template);

        if (!template.action) {
          filteredItems.push(item);
        }
      }

      return filteredItems;
    }
  }
};
</script>

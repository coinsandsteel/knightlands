<template>
  <div v-bar class="height-100">
    <div class="flex flex-column full-flex flex-no-wrap padding-top-1">
      <Title :stackBottom="true" v-if="consumables.length > 0">{{
        "Consumables"
      }}</Title>
      <Inventory
        class="width-100 margin-top-1"
        commitCmd="setMiscFilters"
        :items="consumables"
        :filtersStore="$store.getters.getMiscFilters"
        :hideFilters="true"
        :hideFooter="true"
        :hideBg="true"
        :noScroll="true"
      ></Inventory>

      <Title :stackBottom="true" v-if="charms.length > 0">{{ "Charms" }}</Title>
      <Inventory
        class="width-100 margin-top-1"
        commitCmd="setMiscFilters"
        :items="charms"
        :filtersStore="$store.getters.getMiscFilters"
        :hideFilters="true"
        :hideFooter="true"
        :hideBg="true"
        :noScroll="true"
      ></Inventory>

      <Title :stackBottom="true" v-if="other.length > 0">{{ "Other" }}</Title>
      <Inventory
        class="width-100"
        :class="{ 'margin-top-1': consumables.length > 0 }"
        commitCmd="setMiscFilters"
        :items="other"
        :filtersStore="$store.getters.getMiscFilters"
        :noScroll="true"
      ></Inventory>
    </div>
  </div>
</template>

<script>
import Title from "@/components/Title.vue";
import Inventory from "./Inventory.vue";
const ItemActions = require("@/../../knightlands-shared/item_actions");
const ItemType = require("@/../../knightlands-shared/item_type");

export default {
  components: {
    Inventory,
    Title
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
    charms() {
      let nonEquipment = this.nonEquipment;

      let i = 0;
      const length = nonEquipment.length;
      let filteredItems = [];

      for (; i < length; ++i) {
        const item = nonEquipment[i];
        const template = this.$game.itemsDB.getTemplate(item.template);

        if (template.type == ItemType.Charm) {
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

        if (!template.action && template.type != ItemType.Charm) {
          filteredItems.push(item);
        }
      }

      return filteredItems;
    }
  }
};
</script>

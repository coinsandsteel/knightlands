<template>
  <div class="padding-1 height-100 dummy-height">
    <Promised :promise="request">
      <template v-slot:combined="{ isPending, isDelayOver, data }">
        <LoadingScreen :loading="isPending && isDelayOver"></LoadingScreen>

        <LootContainer
          :items="items"
          :lootProps="{showUnbindLevels: true, showLevel: true}"
        ></LootContainer>
      </template>
    </Promised>
  </div>
</template>

<script>
import AppSection from "@/AppSection";
import { Promised } from "vue-promised";
import PromptMixin from "@/components/PromptMixin.vue";
import LootContainer from "@/components/LootContainer.vue";
import LoadingScreen from "@/components/LoadingScreen.vue";

import ItemFilterComponent from "@/components/ItemFilter.vue";
import { create as CreateDialog } from "vue-modal-dialogs";

const ItemFilter = CreateDialog(ItemFilterComponent);

export default {
  data: () => ({}),
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
  }
};
</script>
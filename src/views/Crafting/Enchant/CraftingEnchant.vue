<template>
  <div class="padding-1 height-100 dummy-height">
    <LootContainer
      :items="items"
      @hint="openUnbind"
      :lootProps="{showUnbindLevels: true, showLevel: true}"
    >
      <span class="font-size-20">{{$t("enchant-list-empty-msg")}}</span>
    </LootContainer>
  </div>
</template>

<script>
import AppSection from "@/AppSection";
import LootContainer from "@/components/LootContainer.vue";
const ItemType = require("@/../knightlands-shared/item_type");

export default {
  mixins: [AppSection],
  components: { LootContainer },
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
    openUnbind(item) {
      this.$router.push({ name: "enchant-item", params: { itemId: item.id } });
    }
  }
};
</script>
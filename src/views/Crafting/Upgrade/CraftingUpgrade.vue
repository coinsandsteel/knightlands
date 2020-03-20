<template>
  <div class="padding-1">
    <LootContainer
      :items="items"
      @hint="openUpgrade"
      :lootProps="{showLevel:true, hideQuantity:true}"
    >
      <span class="font-size-20">{{$t("leveling-list-empty-msg")}}</span>
    </LootContainer>
  </div>
</template>

<script>
import LootContainer from "@/components/LootContainer.vue";
import AppSection from "@/AppSection";
const ItemType = require("@/../knightlands-shared/item_type");

export default {
  mixins: [AppSection],
  components: { LootContainer },
  created() {
    this.title = "window-upgrade-items-list";
  },
  computed: {
    items() {
      const upgradableSlots = this.$game.itemsDB.getUpgradableSlots();
      const filteredItems = [];
      const filteredIds = {};

      // place equipment items first
      for (let slot in this.$game.character.equipment) {
        const gear = this.$game.character.equipment[slot];
        const template = this.$game.itemsDB.getTemplate(gear.template);

        if (
          template.type != ItemType.Equipment ||
          !upgradableSlots[this.$game.itemsDB.getSlot(gear.template)]
        ) {
          continue;
        }

        if (gear.level < this.$game.itemsDB.getMaxLevel(gear)) {
          filteredIds[gear.id] = true;
          filteredItems.push(gear);
        }
      }

      const items = this.$game.inventory.items;
      let i = 0;
      const length = items.length;

      for (; i < length; ++i) {
        let item = items[i];
        let template = this.$game.itemsDB.getTemplate(item.template);

        if (
          template.type != ItemType.Equipment ||
          !upgradableSlots[this.$game.itemsDB.getSlot(item.template)] ||
          filteredIds[item.id]
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
    openUpgrade(item) {
      this.$router.push({ name: "upgrade-item", params: { itemId: item.id } });
    }
  }
};
</script>
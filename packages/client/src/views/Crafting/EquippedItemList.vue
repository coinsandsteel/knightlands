<template>
  <div class="screen-content" :class="{ 'padding-top-1': hasItems }">
    <div v-bar>
      <div class="flex flex-column">
        <template v-if="characterItems.length > 0">
          <Title>{{ $t("char") }}</Title>
          <LootContainer
            class="margin-top-1 margin-bottom-1"
            :items="characterItems"
            :commitCmd="commitCmd"
            :filtersStore="filtersStore"
            :hideFilters="true"
            @hint="hintHandler"
            :lootProps="{
              showEquipped: false,
              showLevel: true,
              hideQuantity: true,
              showUnbindLevels: true
            }"
          />
        </template>

        <template v-if="generalsItems.length > 0">
          <Title>{{ $t("gen") }}</Title>
          <LootContainer
            class="margin-top-1 margin-bottom-1"
            :items="generalsItems"
            :commitCmd="commitCmd"
            :filtersStore="filtersStore"
            :hideFilters="true"
            @hint="hintHandler"
            :lootProps="{
              showEquipped: false,
              showLevel: true,
              hideQuantity: true,
              showUnbindLevels: true
            }"
          />
        </template>

        <template v-if="troopsItems.length > 0">
          <Title>{{ $t("tro") }}</Title>
          <LootContainer
            class="margin-top-1 margin-bottom-1"
            :items="troopsItems"
            :commitCmd="commitCmd"
            :filtersStore="filtersStore"
            :hideFilters="true"
            @hint="hintHandler"
            :lootProps="{
              showEquipped: false,
              showLevel: true,
              hideQuantity: true,
              showUnbindLevels: true
            }"
          />
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import Title from "@/components/Title.vue";
import LootContainer from "@/components/LootContainer.vue";
const ItemType = require("@/../../knightlands-shared/item_type");

export default {
  components: { Title, LootContainer },
  props: ["filter", "hintHandler", "commitCmd", "filtersStore"],
  computed: {
    characterItems() {
      const upgradableSlots = this.$game.itemsDB.getUpgradableSlots();
      const items = [];

      for (let slot in this.$game.character.equipment) {
        const gear = this.$game.inventory.getItem(
          this.$game.character.equipment[slot].id
        );
        const template = this.$game.itemsDB.getTemplate(gear.template);

        if (
          template.type != ItemType.Equipment ||
          !upgradableSlots[this.$game.itemsDB.getSlot(gear.template)]
        ) {
          continue;
        }

        if (this.filter(gear, template)) {
          items.push(gear);
        }
      }

      this.$game.inventory.sortItems(items);

      return items;
    },
    troopsItems() {
      return this.getArmyEquippedItems(true);
    },
    generalsItems() {
      return this.getArmyEquippedItems(false);
    },
    hasItems() {
      return (
        this.characterItems.length > 0 ||
        this.troopsItems.length > 0 ||
        this.generalsItems.length > 0
      );
    }
  },
  methods: {
    getArmyEquippedItems(forTroops) {
      const items = [];
      // get all troops with equipped items
      const units = this.$game.army.getUnits(forTroops);
      const length = units.length;
      for (let i = 0; i < length; ++i) {
        const unit = units[i];
        for (const slot in unit.items) {
          const item = unit.items[slot];
          const template = this.$game.itemsDB.getTemplate(item.template);
          if (this.filter(item, template)) {
            items.push(item);
          }
        }
      }

      this.$game.inventory.sortItems(items);
      console.log(items);

      return items;
    }
  }
};
</script>

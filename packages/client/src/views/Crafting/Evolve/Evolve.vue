<template>
  <div class="screen-content">
    <div class="screen-background"></div>

    <div class="margin-top-2 flex flex-items-center flex-space-evenly">
      <Loot
        :item="item"
        :showEquipped="false"
        :hideQuantity="true"
        :showUnique="false"
      ></Loot>
      <span class="nav-arrow"></span>
      <Loot
        :item="nextItem"
        :showEquipped="false"
        :hideQuantity="true"
        :showUnique="false"
      ></Loot>
    </div>

    <ItemStatsUpgraded
      class="margin-top-2 color-panel-2"
      :item="item"
      :nextLevel="item.level"
      :nextRarity="nextRarity"
    ></ItemStatsUpgraded>
  </div>
</template>

<script>
import AppSection from "@/AppSection.vue";
import Loot from "@/components/Loot.vue";
import ItemStats from "@/components/Item/ItemStats.vue";
import ItemStatsUpgraded from "@/components/Item/ItemStatsUpgraded.vue";
import Rarity from "@/../../knightlands-shared/rarity";

export default {
  mixins: [AppSection],
  props: ["itemId"],
  components: { Loot, ItemStats, ItemStatsUpgraded },
  created() {
    this.$options.useRouterBack = true;
    this.title = "window-evolve";
  },
  computed: {
    item() {
      return this.$game.inventory.getItem(this.itemId);
    },
    nextItem() {
      let nextItem = { ...this.item };
      nextItem.rarity = this.nextRarity;
      return nextItem;
    },
    nextRarity() {
      let rarity = this.item.rarity;
      switch (this.item.rarity) {
        case Rarity.Common:
          rarity = Rarity.Rare;
          break;
        case Rarity.Rare:
          rarity = Rarity.Epic;
          break;
        case Rarity.Epic:
          rarity = Rarity.Legendary;
          break;
        case Rarity.Legendary:
          rarity = Rarity.Mythical;
          break;
      }

      return rarity;
    }
  }
};
</script>

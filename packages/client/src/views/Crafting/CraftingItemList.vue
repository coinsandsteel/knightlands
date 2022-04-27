<template>
  <div class="screen-content">
    <div class="screen-background"></div>
    <div
      class="height-100 width-100 dummy-height flex flex-column flex-no-wrap overflow-hidden"
    >
      <tabs :tabs="tabs" :currentTab="currentTab" @onClick="switchTab" />
      <LootContainer
        class="flex-full overflow-auto height-100"
        ref="allItems"
        :items="filteredItems"
        @hint="handleHint"
        :filtersStore="filtersStore"
        :commitCmd="commitCmd"
        :lootProps="{
          showLevel: true,
          hideQuantity: true,
          showUnbindLevels: true
        }"
        v-show="!onlyEquippedItems"
      >
        <slot></slot>
      </LootContainer>
    </div>

    <keep-alive>
      <EquippedItemList
        v-if="onlyEquippedItems"
        :filter="equippedItemsFilter"
        :hintHandler="handleHint"
        :commitCmd="commitCmd"
        :filtersStore="filtersStore"
      />
    </keep-alive>

    <slot name="footer"></slot>
  </div>
</template>

<script>
import LootContainer from "@/components/LootContainer.vue";
import EquippedItemList from "./EquippedItemList.vue";
import Tabs from "@/components/Tabs.vue";

const OtherItems = "other_items";
const OnlyEquippedItems = "only_items";

export default {
  props: [
    "items",
    "hintHandler",
    "equippedItemsFilter",
    "filtersStore",
    "commitCmd"
  ],
  components: { LootContainer, Tabs, EquippedItemList },
  data: () => ({
    tabs: [
      { title: "other-items", value: OtherItems },
      { title: "only-equipped-items", value: OnlyEquippedItems }
    ],
    currentTab: OtherItems
  }),
  computed: {
    filteredItems() {
      const filteredItems = [];
      const length = this.items.length;
      for (let i = 0; i < length; ++i) {
        const item = this.items[i];
        if (this.onlyEquippedItems == item.equipped) {
          filteredItems.push(item);
        }
      }
      return filteredItems;
    },
    onlyEquippedItems() {
      return this.currentTab == OnlyEquippedItems;
    }
  },
  methods: {
    switchTab(tab) {
      this.currentTab = tab;
    },
    handleHint(item, index, items) {
      this.hintHandler(item, index, items);
    }
  }
};
</script>

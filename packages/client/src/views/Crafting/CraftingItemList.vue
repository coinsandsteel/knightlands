<template>
  <div class="screen-content">
    <div class="screen-background"></div>
    <tabs :tabs="tabs" :currentTab="currentTab" @onClick="switchTab" />
    <LootContainer
      :items="items"
      @hint="hintHandler"
      :lootProps="{
        showLevel: true,
        hideQuantity: true,
        showUnbindLevels: true
      }"
      v-show="!onlyEquippedItems"
    >
      <slot></slot>
    </LootContainer>

    <EquippedItemList
      v-show="onlyEquippedItems"
      :filter="equippedItemsFilter"
      :hintHandler="hintHandler"
    />
  </div>
</template>

<script>
import LootContainer from "@/components/LootContainer.vue";
import EquippedItemList from "./EquippedItemList.vue";
import Tabs from "@/components/Tabs.vue";

const OtherItems = "other_items";
const OnlyEquippedItems = "only_items";

export default {
  props: ["items", "hintHandler", "equippedItemsFilter"],
  components: { LootContainer, Tabs, EquippedItemList },
  data: () => ({
    tabs: [
      { title: "other-items", value: OtherItems },
      { title: "only-equipped-items", value: OnlyEquippedItems }
    ],
    currentTab: OnlyEquippedItems
  }),
  computed: {
    onlyEquippedItems() {
      return this.currentTab == OnlyEquippedItems;
    }
  },
  methods: {
    switchTab(tab) {
      this.currentTab = tab;
    }
  }
};
</script>

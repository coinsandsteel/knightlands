<template>
  <div class="screen-content">
    <div class="screen-background"></div>

    <Tabs :tabs="tabs" :currentTab="currentTab" @onClick="switchTab" />
    <keep-alive>
      <LootContainer
        class="height-100"
        :items="items"
        :filtersStore="$store.getters.getEvolveWeaponFilters"
        commitCmd="setEvolveWeaponFilters"
        :lootProps="{
          showLevel: true,
          hideQuantity: true,
          showUnbindLevels: true
        }"
        v-if="onlyElemental"
      />
      <LootContainer
        v-else
        class="height-100"
        :items="items"
        :filtersStore="$store.getters.getEvolveOtherFilters"
        commitCmd="setEvolveOtherFilters"
        :lootProps="{
          showLevel: true,
          hideQuantity: true,
          showUnbindLevels: true
        }"
      />
    </keep-alive>
  </div>
</template>

<script>
import AppSection from "@/AppSection.vue";
import Tabs from "@/components/Tabs.vue";
import LootContainer from "@/components/LootContainer.vue";

const OtherItems = "other_items";
const ElementalItems = "only_elem";

export default {
  mixins: [AppSection],
  components: { LootContainer, Tabs },
  data: () => ({
    tabs: [
      { title: "other-items", value: OtherItems },
      { title: "elemental", value: ElementalItems }
    ],
    currentTab: OtherItems
  }),
  created() {
    this.$options.useRouterBack = true;
    this.title = "window-evolve";
  },
  computed: {
    onlyElemental() {
      return this.currentTab == ElementalItems;
    },
    items() {
      const filteredItems = [];

      let items = this.$game.inventory.items;
      let i = 0;
      const length = items.length;

      for (; i < length; ++i) {
        const item = items[i];
        const template = this.$game.itemsDB.getTemplate(item.template);

        if (!template.unbindable || item.breakLimit == 2) {
          continue;
        }

        if (this.$game.inventory.getItemsCountByTemplate(item.template) < 2) {
          continue;
        }

        filteredItems.push(item);
      }

      return filteredItems;
    }
  },
  methods: {
    switchTab(tab) {
      this.currentTab = tab;
    }
  }
};
</script>

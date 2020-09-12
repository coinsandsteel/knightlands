<template>
  <div class="screen-content">
    <div class="screen-background"></div>

    <Tabs :tabs="tabs" :currentTab="currentTab" @onClick="switchTab" />
    <keep-alive>
      <EquippedItemList
        class="height-100"
        :filter="filter"
        :hintHandler="hintHandler"
        :filtersStore="$store.getters.getEvolveWeaponFilters"
        commitCmd="setEvolveWeaponFilters"
        :lootProps="{
          hideQuantity: true
        }"
        v-if="onlyElemental && onlyEquipped"
      />
      <EquippedItemList
        v-else-if="!onlyElemental && onlyEquipped"
        class="height-100"
        :filter="filter"
        :hintHandler="hintHandler"
        :filtersStore="$store.getters.getEvolveOtherFilters"
        commitCmd="setEvolveOtherFilters"
        :lootProps="{
          hideQuantity: true
        }"
      />
      <LootContainer
        v-else-if="onlyElemental"
        class="height-100"
        :filter="filter"
        :items="items"
        @hint="hintHandler"
        :filtersStore="$store.getters.getEvolveWeaponFilters"
        commitCmd="setEvolveWeaponFilters"
        :lootProps="{
          hideQuantity: true
        }"
      />
      <LootContainer
        v-else
        class="height-100"
        :items="items"
        :filter="filter"
        @hint="hintHandler"
        :filtersStore="$store.getters.getEvolveOtherFilters"
        commitCmd="setEvolveOtherFilters"
        :lootProps="{
          hideQuantity: true
        }"
      />
    </keep-alive>

    <portal to="footer" v-if="isActive">
      <Toggle
        caption="only-equipped"
        :startValue="onlyEquipped"
        :cb="handleEquippedToggle"
      />
    </portal>
  </div>
</template>

<script>
import AppSection from "@/AppSection.vue";
import Tabs from "@/components/Tabs.vue";
import LootContainer from "@/components/LootContainer.vue";
import EquippedItemList from "../EquippedItemList.vue";
import Elements from "@/../../knightlands-shared/elements";
import Toggle from "@/components/Toggle.vue";

import { create as CreateDialog } from "vue-modal-dialogs";
import EquipmentIngridientHint from "./../EquipmentIngridientHint.vue";
const Hint = CreateDialog(
  EquipmentIngridientHint,
  "type",
  "item",
  "buttons",
  "actions"
);

const OtherItems = "other_items";
const ElementalItems = "only_elem";

const Responses = {
  Select: "select",
  LevelUp: "lvl-up"
};

export default {
  mixins: [AppSection],
  components: { LootContainer, Tabs, EquippedItemList, Toggle },
  data: () => ({
    onlyEquipped: true,
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
  mounted() {
    if (this.$route.query.tab) {
      this.currentTab = this.$route.query.tab;
    }

    if (this.$route.query.item) {
      this.hintHandler(this.$game.inventory.getItem(this.$route.query.item));
    }
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
        if (item.equipped) {
          continue;
        }

        const template = this.$game.itemsDB.getTemplate(item.template);

        const isElemental =
          this.$game.itemsDB.getElement(item) != Elements.Physical;
        if (!template.unbindable || this.onlyElemental != isElemental) {
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
    },
    filter(item, template) {
      const isElemental =
        this.$game.itemsDB.getElement(item) != Elements.Physical;
      return template.unbindable && this.onlyElemental == isElemental;
    },
    handleEquippedToggle(value) {
      this.onlyEquipped = value;
    },
    async hintHandler(item) {
      let buttons = [
        {
          type: "yellow",
          response: Responses.Select,
          title: "btn-select"
        }
      ];

      let hintType;
      if (this.$game.itemsDB.getMaxLevel(item) != item.level) {
        hintType = "not-max-lvl";
        buttons = [
          {
            type: "yellow",
            response: Responses.LevelUp,
            title: "btn-level-up"
          }
        ];
      }

      const response = await Hint(hintType, item, buttons, {
        actions: { equip: false }
      });

      if (response == Responses.Select) {
        this.evolve(item);
      } else if (response == Responses.LevelUp) {
        this.levelUp(item);
      }
    },
    evolve(item) {
      this.$router.push({
        name: "evolve-item",
        params: { itemId: item.id }
      });
    },
    levelUp(item) {
      let query = {
        returnTo: this.$route.fullPath,
        tab: this.currentTab,
        item: item.id
      };
      if (item.breakLimit < 2) {
        this.$router.push({
          name: "unbind-item",
          params: { itemId: item.id },
          query
        });
      } else {
        this.$router.push({
          name: "upgrade-item",
          params: { itemId: item.id },
          query
        });
      }
    }
  }
};
</script>

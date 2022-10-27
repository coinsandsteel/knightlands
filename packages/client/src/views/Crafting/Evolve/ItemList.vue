<template>
  <div class="screen-content">
    <div class="screen-background"></div>
    <div
      class="height-100 width-100 dummy-height flex flex-column flex-no-wrap overflow-hidden"
    >
      <Tabs :tabs="tabs" :currentTab="currentTab" @onClick="switchTab" />
      <keep-alive>
        <EquippedItemList
          v-if="onlyElemental && onlyEquipped"
          class="flex-full overflow-auto height-100"
          :filter="filter"
          :hintHandler="hintHandler"
          :filtersStore="$store.getters.getEvolveWeaponFilters"
          commitCmd="setEvolveWeaponFilters"
          :lootProps="{
            hideQuantity: true
          }"
        />
        <EquippedItemList
          v-else-if="!onlyElemental && onlyEquipped"
          class="flex-full overflow-auto height-100"
          :filter="filter"
          :hintHandler="hintHandler"
          :filtersStore="$store.getters.getEvolveOtherFilters"
          commitCmd="setEvolveOtherFilters"
          :lootProps="{
            hideQuantity: true
          }"
        />
      </keep-alive>

      <LootContainer
        v-show="onlyElemental && !onlyEquipped"
        ref="weaponsContainer"
        class="flex-full overflow-auto height-100"
        :filter="filter"
        :items="items"
        :hideFilters="true"
        @hint="hintHandler"
        :filtersStore="$store.getters.getEvolveWeaponFilters"
        commitCmd="setEvolveWeaponFilters"
        :lootProps="{
          hideQuantity: true
        }"
      />
      <LootContainer
        v-show="!onlyElemental && !onlyEquipped"
        ref="othersContainer"
        class="flex-full overflow-auto height-100"
        :items="items"
        :filter="filter"
        :hideFilters="true"
        @hint="hintHandler"
        :filtersStore="$store.getters.getEvolveOtherFilters"
        commitCmd="setEvolveOtherFilters"
        :lootProps="{
          hideQuantity: true
        }"
      />
    </div>

    <portal to="footer" v-if="isActive">
      <Toggle
        caption="only-equipped"
        :startValue="onlyEquipped"
        :cb="handleEquippedToggle"
      />
      <HintButton
        title="i-evolve"
        :texts="['i-evolve-1', 'i-evolve-2']"
      ></HintButton>
      <CustomButton type="grey" @click="showItemFilter">{{
        $t("btn-filter")
      }}</CustomButton>
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
import CustomButton from "@/components/Button.vue";
import Rarity from "@/../../knightlands-shared/rarity";
import HintButton from "@/components/HintButton.vue";
const { EventItemType } = require("@/../../knightlands-shared/item_type");

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
  components: {
    LootContainer,
    Tabs,
    EquippedItemList,
    Toggle,
    CustomButton,
    HintButton
  },
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
  mounted() {
    if (this.$route.query.tab) {
      this.currentTab = this.$route.query.tab;
    }

    if (this.$route.query.item) {
      this.hintHandler(this.$game.inventory.getItem(this.$route.query.item));
    }
  },
  computed: {
    onlyEquipped() {
      return this.$store.getters.getEvolveToggle;
    },
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

        if (this.$game.itemsDB.isAccessory(item)) {
          continue;
        }

        const template = this.$game.itemsDB.getTemplate(item.template);
        if (
          template.rarity == Rarity.Mythical ||
          template.type === "lunarResource" ||
          template.type === "marchResource" ||
          template.type === "aprilResource"
        ) {
          continue;
        }

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
    showItemFilter() {
      if (this.onlyElemental) {
        this.$refs.weaponsContainer.showItemFilter();
      } else {
        this.$refs.othersContainer.showItemFilter();
      }
    },
    switchTab(tab) {
      this.currentTab = tab;
    },
    filter(item, template) {
      const isElemental =
        this.$game.itemsDB.getElement(item) != Elements.Physical;
      return (
        template.rarity != Rarity.Mythical &&
        template.unbindable &&
        this.onlyElemental == isElemental &&
        !this.$game.itemsDB.isAccessory(item)
      );
    },
    handleEquippedToggle(value) {
      this.$store.commit("setEvolveToggle", value);
    },
    async hintHandler(item) {
      let buttons;
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
      } else {
        this.evolve(item);
        return;
      }

      const response = await Hint(hintType, item, buttons, {
        actions: { equip: false }
      });

      if (response == Responses.LevelUp) {
        this.levelUp(item);
      }
    },
    evolve(item) {
      this.$router.push({
        name: "evolve-item",
        params: { baseItemId: item.id }
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

<script>
const EquipmentType = require("@/../knightlands-shared/equipment_type");
import CraftingList from "./CraftingList.vue";

const CraftingRecipes = require("@/crafting_recipes_by_category");

const TabNames = {
  mainHand: "main_hand",
  offHand: "off_hand",
  armour: "armour",
  accessory: "accessory"
};

const TabIcons = {
  mainHand: "tab_menu_icon_mainhand",
  offHand: "tab_menu_icon_offhand",
  armour: "tab_menu_icon_helmet",
  accessory: "tab_menu_icon_helmet"
};

export default {
  extends: CraftingList,
  created() {
    this.listId = "equipment";

    for (let i in TabNames) {
      this.tabs.push({
        icon: TabIcons[i],
        value: TabNames[i]
      });
    }

    this.currentTab = this.tabs[0].value;
    this.recipes = [];
    this.filterItems();
  },
  watch: {
    currentTab() {
      this.filterItems();
    }
  },
  methods: {
    filterItems() {
      let filters = {};
      let recipes = CraftingRecipes[1] || [];

      switch (this.currentTab) {
        case TabNames.mainHand:
          filters[EquipmentType.Axe] = true;
          filters[EquipmentType.Sword] = true;
          filters[EquipmentType.Spear] = true;
          filters[EquipmentType.Bow] = true;
          filters[EquipmentType.Wand] = true;
          break;

        case TabNames.offHand:
          filters[EquipmentType.Shield] = true;
          filters[EquipmentType.Star] = true;
          filters[EquipmentType.Whip] = true;
          filters[EquipmentType.Knive] = true;
          filters[EquipmentType.Scythe] = true;
          break;

        case TabNames.armour:
          filters[EquipmentType.Helmet] = true;
          filters[EquipmentType.Cape] = true;
          filters[EquipmentType.Chest] = true;
          filters[EquipmentType.Gloves] = true;
          filters[EquipmentType.Boots] = true;
          break;

        case TabNames.accessory:
          filters[EquipmentType.Ring] = true;
          filters[EquipmentType.Necklace] = true;
          break;
      } 

      this.recipes.length = 0;

      let i = 0;
      const length = recipes.length;
      const itemsDB = this.$game.itemsDB;
      const crafting = this.$game.crafting;
      for (; i < length; ++i) {
        if (filters[itemsDB.getEquipmentType(crafting.getRecipe(recipes[i]).resultItem)]) {
          this.recipes.push(recipes[i]);
        }
      }

      this.updateRecipes();
    }
  }
};
</script>
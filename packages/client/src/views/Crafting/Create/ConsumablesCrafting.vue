<script>
import CraftingList from "./CraftingList.vue";

const CraftingRecipes = require("@/crafting_recipes_by_category");

const TabNames = {
  main_hand: "main_hand",
  off_hand: "off_hand",
  armour: "armour"
};

const TabIcons = {
  main_hand: "tab_menu_icon_mainhand",
  off_hand: "tab_menu_icon_offhand",
  armour: "tab_menu_icon_helmet"
};

export default {
  extends: CraftingList,
  created() {
    this.listId = "consumables";

    for (let i in TabNames) {
      this.tabs.push({
        icon: TabIcons[i],
        value: TabNames[i]
      });
    }

    this.currentTab = this.tabs[0].value;
    this.recipes = CraftingRecipes[2] || [];

    this.updateRecipes();
  }
};
</script>
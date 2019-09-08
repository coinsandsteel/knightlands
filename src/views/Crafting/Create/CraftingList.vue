<template>
  <div class="flex full-flex flex-column relative dummy-height flex-column">
    <IconTabs :tabs="tabs" :currentTab="currentTab" @onClick="handleTab"></IconTabs>
    <div class="full-flex height-100 dummy-height relative">
      <div class="wrapper dummy-height">
        <RecycleScroller
          class="scroller"
          :items="filteredRecipes"
          :item-size="112"
          key-field="id"
          v-slot="{ item }"
        >
          <CraftingRecipeListElement :recipe="item" @craft="handleCraft"></CraftingRecipeListElement>
        </RecycleScroller>
      </div>
    </div>
  </div>
</template>

<script>
import TabHandler from "@/components/TabHandler.vue";
import IconTabs from "./IconTabs.vue";
import CraftingRecipeListElement from "./CraftingRecipeListElement.vue";
import Toggle from "@/components/Toggle.vue";
import AppSection from "@/AppSection";

export default {
  mixins: [TabHandler, AppSection],
  components: { IconTabs, CraftingRecipeListElement, Toggle },
  data: () => ({
    recipes: [],
    filtered: [],
    filteredRecipes: [],
    onlyAvailabe: false,
    listId: ""
  }),
  mounted() {
    this.handleAvailableToggle(this.$store.getters.getAvailableSwitchInCraftingList(this.listId));
  },
  activated() {
    this.addFooter(Toggle, {
      cb: this.handleAvailableToggle.bind(this),
      caption: "toggle-available-recipes",
      startValue: this.onlyAvailabe
    });
  },
  watch: {
    recipes() {
      this.handleAvailableToggle(this.onlyAvailabe);
    }
  },
  methods: {
    handleCraft(recipeId) {
      this.$router.push({
        name: "craft",
        params: {
          recipeId
        }
      });
    },
    updateList() {
      this.filteredRecipes = this.onlyAvailabe ? this.filtered : this.recipes;
    },
    handleAvailableToggle(value) {
      this.$store.commit("setAvailableSwitchInCraftingList", {
        listId: this.listId,
        value
      });

      this.onlyAvailabe = value;
      this.filtered.length = 0;

      if (value) {
          let i = 0;
          const length = this.recipes.length;
          
          for (; i < length; ++i) {
            if (this.$game.crafting.hasEnoughResourcesForRecipe(this.recipes[i])) {
              this.filtered.push(this.recipes[i]);
            }
          }
      }

      this.updateList();
    }
  }
};
</script>

<style lang="less" scoped>
.scroller {
  width: 100%;
  height: 100%;
}

.wrapper {
  overflow: hidden;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}
</style>
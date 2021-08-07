<template>
  <div class="flex full-flex flex-column relative dummy-height flex-column">
    <!-- <IconTabs
      :tabs="tabs"
      :currentTab="currentTab"
      @onClick="handleTab"
    ></IconTabs> -->
    <div class="full-flex height-100 dummy-height relative">
      <div class="wrapper dummy-height height-100">
        <RecycleScroller
          ref="scroller"
          class="width-100 height-100"
          :items="filteredRecipes"
          :item-size="112"
          key-field="id"
          v-slot="{ item }"
        >
          <CraftingRecipeListElement
            :recipe="item"
            @craft="handleCraft"
            :ingridientHintHandler="handleIngridientHint"
          ></CraftingRecipeListElement>
        </RecycleScroller>
      </div>
    </div>

    <portal v-if="isActive" to="footer">
      <Toggle
        :cb="handleAvailableToggle"
        :startValue="onlyAvailable"
        caption="toggle-available-recipes"
      ></Toggle>
      <CustomButton type="grey" @click="showItemFilter">{{
        $t("btn-filter")
      }}</CustomButton>
    </portal>
  </div>
</template>

<script>
import TabHandler from "@/components/TabHandler.vue";
import CraftingRecipeListElement from "./CraftingRecipeListElement.vue";
import Toggle from "@/components/Toggle.vue";
import AppSection from "@/AppSection.vue";
import CustomButton from "@/components/Button.vue";
import HintHandler from "@/components/HintHandler.vue";

import { create } from "vue-modal-dialogs";
import RecipeFilter from "./../RecipeFilter.vue";
const ShowFilters = create(RecipeFilter, "id", "types");

export default {
  mixins: [TabHandler, AppSection, HintHandler],
  components: { CraftingRecipeListElement, Toggle, CustomButton },
  data: () => ({
    recipes: [],
    filtered: [],
    filteredRecipes: [],
    onlyAvailable: false,
    listId: "",
    filters: {}
  }),
  mounted() {
    this.onlyAvailable = this.$store.getters.getAvailableSwitchInCraftingList(
      this.listId
    );
  },
  activated() {
    this.handleAvailableToggle(this.onlyAvailable);

    if (this.scrollState) {
      this.$nextTick(() => {
        this.$refs.scroller.updateVisibleItems(false);
        this.$refs.scroller.scrollToPosition(this.scrollState.start);
      });
    } else {
      this.$refs.scroller.updateVisibleItems(false);
    }
  },
  watch: {
    recipes() {
      this.handleAvailableToggle(this.onlyAvailable);
    }
  },
  methods: {
    async handleIngridientHint(item) {
      let buttons = [];
      let recipe = this.$game.crafting.getRecipeByItem(item.template);
      if (recipe) {
        buttons.push({
          type: "yellow",
          title: "btn-open-craft",
          response: true
        });
      }

      let response = await this.showHint(item, buttons, {});
      if (response === true) {
        // go to ingridient item
        this.handleCraft(recipe.id);
      }
    },
    async showItemFilter() {
      await ShowFilters(this.listId, {});
      this.filters = this.$store.getters.getRecipeFilters(this.listId);
      this.handleAvailableToggle(this.onlyAvailable);
    },
    handleCraft(recipeId) {
      this.scrollState = this.$refs.scroller.getScroll();

      this.$router.push({
        name: "craft",
        params: {
          recipeId
        }
      });
    },
    updateList() {
      let recipes = this.onlyAvailable ? this.filtered : this.recipes;

      if (!this.filters.rarity) {
        this.filters = this.$store.getters.getRecipeFilters(this.listId);
      }

      let i = 0;
      const length = recipes.length;
      this.filteredRecipes.length = 0;
      for (; i < length; ++i) {
        let recipe = this.$game.crafting.getRecipe(recipes[i]);
        let rarity = this.$game.itemsDB.getRarity(recipe.resultItem);
        if (this.filters.rarity[rarity]) {
          this.filteredRecipes.push(recipe.id);
        }
      }

      this.$nextTick(() => {
        this.$refs.scroller.updateVisibleItems(false);
      });
    },
    updateRecipes() {
      this.sortRecipes(this.recipes);
    },
    sortRecipes(recipes) {
      const itemsDB = this.$game.itemsDB;
      const crafting = this.$game.crafting;
      recipes.sort((a, b) => {
        let recipeA = crafting.getRecipe(a);
        let recipeB = crafting.getRecipe(b);
        let sortingFactorA = itemsDB.getRarityAsNumber(recipeA.resultItem);
        let sortingFactorB = itemsDB.getRarityAsNumber(recipeB.resultItem);

        if (sortingFactorA == sortingFactorB) {
          sortingFactorA = recipeA.id;
          sortingFactorB = recipeB.id;
        }

        if (sortingFactorA > sortingFactorB) {
          return 1;
        }

        if (sortingFactorA < sortingFactorB) {
          return -1;
        }

        return 0;
      });
    },
    handleAvailableToggle(value) {
      this.$store.commit("setAvailableSwitchInCraftingList", {
        listId: this.listId,
        value
      });

      this.onlyAvailable = value;
      this.filtered.length = 0;

      if (value) {
        let i = 0;
        const length = this.recipes.length;

        for (; i < length; ++i) {
          if (
            this.$game.crafting.hasEnoughResourcesForRecipe(this.recipes[i])
          ) {
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
.wrapper {
  overflow: hidden;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}
</style>

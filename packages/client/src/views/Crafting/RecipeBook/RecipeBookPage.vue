<template>
  <div class="flex relative recipe-page margin-bottom-half">
    <div class="dummy-height">
      <div v-bar>
        <div ref="panel" class="flex">
          <recipe-scheme
            v-for="(recipe, index) in recipes"
            :key="recipe"
            :hasNext="index+1 < recipes.length"
            :recipe="recipe"
            @hint="handleIngridientHint"
          ></recipe-scheme>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AppSection from "@/AppSection.vue";
import CraftingIngridientHintHandler from "@/components/CraftingIngridientHintHandler.vue";
import ItemToRecipe from "@/metadata/item_to_recipe";

export default {
  mixins: [AppSection, CraftingIngridientHintHandler],
  components: {},
  props: ["recipeId"],
  data: () => ({
    recipes: []
  }),
  created() {
    this.title = this.$game.itemsDB.getName(this.recipe.resultItem);
    this.$options.useRouterBack = true;

    this.recipes.push(this.recipeId);
    let currentRecipe = this.recipeId;

    while (true) {
      let resultItem = this.$game.crafting.getResultItem(currentRecipe);
      const recipe = ItemToRecipe[resultItem];
      this.title = this.$game.itemsDB.getName(resultItem);
      if (recipe) {
        currentRecipe = recipe;
        this.recipes.push(currentRecipe);
      } else {
        break;
      }
    }
  },
  destroyed() {
    if (this.panzoom) {
      this.panzoom.dispose();
    }
  },
  computed: {
    recipe() {
      return this.$game.crafting.getRecipe(this.recipeId);
    }
  }
};
</script>

<style lang="less" scoped>
.recipe-page {
  overflow: hidden;

  //   background-color: #3d485a;
}
</style>

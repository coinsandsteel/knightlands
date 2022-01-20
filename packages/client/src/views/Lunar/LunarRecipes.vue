<template>
  <div class="screen-content">
    <div class="full-flex dummy-height width-100">
      <div
        class="width-100 height-100 dummy-height flex flex-column flex-no-wrap"
      >
        <div
          class="inv-root dummy-height full-flex width-100 height-100 margin-top-1"
        >
          <div v-bar class="center width-100 height-100 dummy-height">
            <div>
              <div
                class="search-container flex flex-justify-center flex-items-center"
              >
                <div>
                  <!-- searchbox -->
                  <input
                    type="text"
                    :placeholder="$t('lantern-name')"
                    class="recipes-search-input input lantern-name-input white-font margin-bottom-1 text-align-center"
                    aria-describedby="input name input"
                    v-model="searchText"
                    v-on:keyup.enter="searchHandler"
                  />
                  <CustomButton
                    type="blue"
                    class="btn-search inline-block uppercase padding-left-2"
                    @click="searchHandler"
                  >
                    {{ $t("btn-search") }}
                  </CustomButton>
                </div>
              </div>
              <!-- recipe list -->
              <LunarCraftingRecipe
                v-for="(recipe, index) in recipesList"
                :key="index"
                :recipe="recipe"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { capitalize } from "@/helpers/utils";
import items from "@/items.json";
import {
  ADVANCED_RECIPES,
  EXPERT_RECIPES
} from "@/../../knightlands-shared/lunar";
import LunarCraftingRecipe from "@/views/Lunar/LunarCraftingRecipe.vue";
import CustomButton from "@/components/Button.vue";

export default {
  components: {
    LunarCraftingRecipe,
    CustomButton
  },
  data() {
    return {
      searchText: "",
      appliedSearchText: ""
    };
  },
  computed: {
    allLunarItems() {
      return Object.values(items).filter(
        ({ type }) => type === "lunarResource"
      );
    },
    lunarItems() {
      return this.$game.inventory.items.filter(
        ({ template }) => template >= 3214
      );
    },
    recipesList() {
      // const item = {
      //   id: 4,
      //   isCustomElement: true,
      //   itemSlotClasses: "lunar-lantern-slot",
      //   iconClasses: "basic-lantern4",
      //   name: "Spring Spirit",
      //   ingredients: [
      //     {
      //       id: 1,
      //       isCustomElement: true,
      //       itemSlotClasses: "lunar-lantern-slot",
      //       iconClasses: "basic-lantern1"
      //     },
      //     {
      //       id: 2,
      //       isCustomElement: true,
      //       itemSlotClasses: "lunar-lantern-slot",
      //       iconClasses: "basic-lantern2"
      //     },
      //     {
      //       id: 3,
      //       isCustomElement: true,
      //       itemSlotClasses: "lunar-lantern-slot",
      //       iconClasses: "basic-lantern3"
      //     }
      //   ]
      // };
      // const recipe = {
      //   title: capitalize(this.$t("lunar-common")),
      //   items: [item, item, item, item]
      // };
      // const result = [];

      // result.push(recipe);
      // result.push({ ...recipe, title: capitalize(this.$t("lunar-rare")) });
      // // result.push({ ...recipe, title: "lunar-epic" });

      const result = [];

      const basicRecipes = {
        title: capitalize(this.$t("lunar-common")),
        items: []
      };
      // basicRecipes.items = ADVANCED_RECIPES.map((recipe, recipeIndex) => {
      //   return {
      //     id: recipeIndex,
      //     isCustomElement: true,
      //     itemSlotClasses: "lunar-lantern-slot",
      //     iconClasses: "basic-lantern4",
      //     name: "Spring Spirit",
      //     ingredients: recipe.ingredients.map(
      //       (ingredient, ingredientIndex) => ({
      //         id: ingredientIndex,
      //         isCustomElement: true,
      //         itemSlotClasses: "lunar-lantern-slot",
      //         iconClasses: "basic-lantern1"
      //       })
      //     )
      //   };
      // });
      basicRecipes.items = ADVANCED_RECIPES.map(this.generateRecipeItem)
        .filter(this.filterIngredient)
        .sort(this.sortIngredient);
      result.push(basicRecipes);

      const advancedRecipes = {
        title: capitalize(this.$t("lunar-rare")),
        items: []
      };
      // advancedRecipes.items = EXPERT_RECIPES.map((recipe, recipeIndex) => ({
      //   id: recipeIndex,
      //   isCustomElement: true,
      //   itemSlotClasses: "lunar-lantern-slot",
      //   iconClasses: "basic-lantern4",
      //   name: "Spring Spirit",
      //   ingredients: recipe.ingredients.map((ingredient, ingredientIndex) => ({
      //     id: ingredientIndex,
      //     isCustomElement: true,
      //     itemSlotClasses: "lunar-lantern-slot",
      //     iconClasses: "basic-lantern1"
      //   }))
      // }));
      advancedRecipes.items = EXPERT_RECIPES.map(this.generateRecipeItem)
        .filter(this.filterIngredient)
        .sort(this.sortIngredient);
      result.push(advancedRecipes);

      // filter by search text

      return result;
    }
  },
  methods: {
    filterIngredient(item) {
      return !!item;
    },
    sortIngredient(a, b) {
      if (a.ingredients.length < b.ingredients.length) {
        return -1;
      }

      if (a.ingredients.length > b.ingredients.length) {
        return 1;
      }

      return 0;
    },
    generateRecipeItem(recipe) {
      const text = this.appliedSearchText.trim().toLowerCase();
      let searchMatched = !(text.length > 0);
      const achievement = {
        ...this.allLunarItems.find(
          ({ caption }) => caption === recipe.achievement
        ),
        isCustomElement: true,
        itemSlotClasses: "lunar-lantern-slot",
        iconClasses:
          "basic_lantern" + recipe.achievement[recipe.achievement.length - 1],
        name: this.$t(recipe.achievement)
      };
      searchMatched =
        searchMatched || achievement.name.toLowerCase().includes(text);
      const ingredients = [];

      for (let i = 0; i < recipe.ingredients.length; i++) {
        const ingredient = {
          ...this.allLunarItems.find(
            ({ caption }) => caption === recipe.ingredients[i]
          ),
          isCustomElement: true,
          itemSlotClasses: "lunar-lantern-slot",
          iconClasses:
            "basic_lantern" +
            recipe.ingredients[i][recipe.ingredients[i].length - 1],
          name: this.$t(recipe.ingredients[i]),
          ingredientCount: 1,
          quantity: 0,
          ingredientId: 0
        };
        const ownedItem = this.lunarItems.find(
          ({ template }) => template === ingredient.id
        );
        if (ownedItem) {
          ingredient.quantity = ownedItem.count;
          ingredient.ingredientId = ownedItem.id;
        }
        const addedIngredient = ingredients.find(
          ({ id }) => id === ingredient.id
        );
        if (addedIngredient) {
          addedIngredient.ingredientCount++;
        } else {
          ingredients.push(ingredient);
          searchMatched =
            searchMatched || ingredient.name.toLowerCase().includes(text);
        }
      }

      achievement.ingredients = ingredients;
      achievement.canCraft = ingredients.every(
        ({ quantity, ingredientCount }) => quantity >= ingredientCount
      );

      return searchMatched ? achievement : null;
    },
    searchHandler() {
      this.appliedSearchText = this.searchText.trim();
    }
  }
};
</script>
<style scoped lang="less">
.search-container {
  background: #2e7285;
  height: 80px;
}
.recipes-search-input {
  height: 5rem;
  width: 230px;
  margin-left: 70px;
  max-width: calc(100% - 150px);
}
</style>

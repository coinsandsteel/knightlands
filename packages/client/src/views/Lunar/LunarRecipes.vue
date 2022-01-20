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
import { mapState } from "vuex";
import { capitalize } from "@/helpers/utils";
import recipes from "@/crafting_recipes.json";
import {
  ITEM_RARITY_ADVANCED,
  ITEM_RARITY_EXPERT
} from "@/../../knightlands-shared/lunar";
import LunarCraftingRecipe from "@/views/Lunar/LunarCraftingRecipe.vue";
import CustomButton from "@/components/Button.vue";

const lunarRecipes = Object.values(recipes).filter(
  ({ category }) => category === "lunar"
);

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
    ...mapState("lunar", ["usedRecipes"]),
    lunarItems() {
      return this.$game.inventory.items.filter(({ template }) => {
        const info = this.$game.itemsDB.getTemplate(template);
        return info.type === "lunarResource";
      });
    },
    recipesList() {
      const result = [];
      const list = lunarRecipes
        .filter(({ id }) => this.usedRecipes && this.usedRecipes.includes(id))
        .map(this.generateRecipeItem)
        .filter(item => !!item);

      const basicRecipes = {
        title: capitalize(this.$t("lunar-common")),
        items: list
          .filter(item => item && item.rarity === ITEM_RARITY_ADVANCED)
          .sort(this.sortIngredient)
      };
      if (basicRecipes.items.length > 0) {
        result.push(basicRecipes);
      }

      const advancedRecipes = {
        title: capitalize(this.$t("lunar-rare")),
        items: list
          .filter(item => item && item.rarity === ITEM_RARITY_EXPERT)
          .sort(this.sortIngredient)
      };
      if (advancedRecipes.items.length > 0) {
        result.push(advancedRecipes);
      }

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

      const achievementInfo = this.$game.itemsDB.getTemplate(recipe.resultItem);
      const achievement = {
        ...achievementInfo,
        isCustomElement: true,
        itemSlotClasses: "lunar-lantern-slot",
        iconClasses: achievementInfo.icon,
        name: this.$t(achievementInfo.caption)
      };
      searchMatched =
        searchMatched || achievement.name.toLowerCase().includes(text);

      const ingredients = [];
      for (let i = 0; i < recipe.ingridients.length; i++) {
        const ingredientId = recipe.ingridients[i].itemId;
        const ingredientInfo = this.$game.itemsDB.getTemplate(ingredientId);
        const ingredient = {
          ...ingredientInfo,
          isCustomElement: true,
          itemSlotClasses: "lunar-lantern-slot",
          iconClasses: ingredientInfo.icon,
          name: this.$t(ingredientInfo.caption),
          ingredientCount: 1,
          quantity: 0
        };
        const ownedItem = this.lunarItems.find(
          ({ template }) => template === ingredient.id
        );
        if (ownedItem) {
          ingredient.quantity = ownedItem.count;
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

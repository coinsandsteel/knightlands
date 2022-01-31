<template>
  <div class="screen-content">
    <div class="full-flex width-100" v-bar>
      <div
        class="width-100 height-100 dummy-height flex flex-column flex-no-wrap"
      >
        <div
          v-for="(recipe, recipeIndex) in recipes"
          :key="`recipe-${recipeIndex}`"
          class="margin-bottom-5"
        >
          <div
            class="recipe-name font-size-25 text-align-center padding-top-2 padding-bottom-2 capitalize"
            :key="`recipe-name-${recipeIndex}`"
          >
            <div class="flex flex-center flex-column">
              <div class="margin-bottom-3">
                {{ recipe.name }}
              </div>
              <div class="margin-bottom-2">
                <Loot
                  :key="`recipe-result-${recipeIndex}`"
                  :item="recipe.id"
                  :inventory="false"
                  :quantity="recipe.resultItemQuantity"
                  :itemSlotClasses="
                    recipe && recipe.itemSlotClasses
                      ? recipe.itemSlotClasses
                      : null
                  "
                  :iconClasses="
                    recipe && recipe.iconClasses ? recipe.iconClasses : null
                  "
                >
                </Loot>
              </div>
              <div class="text-center" :key="`craft-btn-${recipeIndex}`">
                <CustomButton
                  :disabled="!recipe.canCraft"
                  type="green"
                  class="btn-combine inline-block uppercase padding-left-2"
                  @click="craftHandler(recipe.recipeId)"
                >
                  {{ $t("btn-combine") }}
                </CustomButton>
              </div>
            </div>
          </div>

          <div
            :key="`recipe-ingredients-${recipeIndex}`"
            class="recipe-ingredients width-100 inventory-container padding-top-4 padding-bottom-2 padding-left-1 padding-right-1"
          >
            <Loot
              v-for="(item, itemIndex) in recipe.ingredients"
              :id="`i-${item.id}`"
              :item="item.id"
              :key="itemIndex"
              :quantity="item.quantity"
              :inventory="false"
              :itemSlotClasses="item && item.icon ? item.itemSlotClasses : null"
              :iconClasses="item && item.icon ? item.icon : null"
              :class="{
                'opacity-50': !item.quantity
              }"
            >
            </Loot>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import NetworkRequestErrorMixin from "@/components/NetworkRequestErrorMixin.vue";
import ActivityMixin from "@/components/ActivityMixin.vue";
import Loot from "@/components/Loot.vue";
import CustomButton from "@/components/Button.vue";
import ShowItemsMixin from "@/components/ShowItemsMixin.vue";

import {
  ITEM_RARITY_EXPERT,
  ITEM_RARITY_NFT,
  RARITY_CLASS_MAP
} from "@/../../knightlands-shared/lunar";
import recipes from "@/crafting_recipes.json";

const nftRecipes = Object.values(recipes).filter(
  ({ category, ingridients }) =>
    category === "lunar" && ingridients.length >= 10
);

export default {
  components: {
    Loot,
    CustomButton
  },
  mixins: [ActivityMixin, NetworkRequestErrorMixin, ShowItemsMixin],
  data() {
    return {};
  },
  computed: {
    recipes() {
      return nftRecipes.map(this.generateRecipeItem.bind(this));
    },
    nfts() {
      return this.$game.inventory.items.filter(({ template }) => {
        const info = this.$game.itemsDB.getTemplate(template);
        return info.type === "lunarResource" && info.rarity === ITEM_RARITY_NFT;
      });
    },
    items() {
      let items = this.$game.inventory.items.filter(({ template }) => {
        const info = this.$game.itemsDB.getTemplate(template);
        return (
          info.type === "lunarResource" && info.rarity === ITEM_RARITY_EXPERT
        );
      });
      let i = 0;
      const length = items.length;
      let filteredItems = [];
      for (; i < length; ++i) {
        const item = items[i];
        filteredItems.push({
          ...item,
          itemSlotClasses: "lunar-lantern-slot",
          isCustomElement: true
        });
      }
      return filteredItems;
    }
  },

  methods: {
    generateRecipeItem(recipe) {
      const achievementInfo = this.$game.itemsDB.getTemplate(recipe.resultItem);
      const achievement = {
        ...achievementInfo,
        resultItemQuantity: this.$game.inventory.getItemsCountByTemplate(
          recipe.resultItem
        ),
        recipeId: recipe.id,
        isCustomElement: true,
        itemSlotClasses: "lunar-lantern-slot",
        iconClasses: achievementInfo.icon,
        name: this.$t(achievementInfo.caption)
      };

      const ingredients = [];
      for (let i = 0; i < recipe.ingridients.length; i++) {
        const ingredientId = recipe.ingridients[i].itemId;
        const ingredientInfo = this.$game.itemsDB.getTemplate(ingredientId);
        let lanternIds = [1, 2, 3, 4, 1, 2, 3, 4, 1, 2];
        let idString = ingredientInfo.id.toString();
        let lanternId = lanternIds[idString[idString.length - 1]];
        let icon = "basic_lantern" + lanternId;

        const ingredient = {
          ...ingredientInfo,
          isCustomElement: true,
          itemSlotClasses: "lunar-lantern-slot",
          iconClasses: `${RARITY_CLASS_MAP[ingredientInfo.rarity]} ${icon}`,
          name: this.$t(ingredientInfo.caption),
          ingredientCount: 1
        };
        const ownedItem = this.items.find(
          ({ template }) => template === ingredient.id
        );
        if (ownedItem) {
          ingredient.quantity = ownedItem.count;
        } else {
          ingredient.quantity = 0;
        }
        ingredients.push(ingredient);
      }

      achievement.ingredients = ingredients;
      achievement.canCraft = ingredients.every(
        ({ quantity, ingredientCount }) => quantity >= ingredientCount
      );

      return achievement;
    },
    async craftHandler(recipeId) {
      if (this.hasCrafted) {
        return;
      }
      const items = await this.performRequest(
        this.$store.dispatch("lunar/craft", { recipeId })
      );

      await this.showItems(items);
    }
  }
};
</script>
<style scoped lang="less">
.v-bar-fix {
  & > div {
    overflow: auto !important;
  }
}
.recipe-ingredients {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(8rem, 1fr));
  justify-items: center;
  grid-gap: 2rem;
}
.recipe-name {
  background: rgba(0, 0, 0, 0.5);
}
</style>

<template>
  <div class="width-100 relative recipe padding-bottom-4">
    <!-- <Title :stackTop="true">{{ recipe.title }}</Title> -->

    <div
      class="rarity-name font-size-25 text-align-left padding-top-1 padding-bottom-1 padding-left-2 padding-right-2 capitalize"
    >
      {{ $t(`${recipe.title}-elements`) }}
    </div>

    <div
      v-for="(item, index) in recipe.items"
      :key="index"
      class="flex flex-no-wrap flex-center padding-left-2 padding-right-2 margin-top-4"
    >
      <!-- ingredients -->
      <div class="flex">
        <Loot
          v-for="(ingredient, ingredientIndex) in item.ingredients"
          :key="ingredientIndex"
          :item="ingredient"
          :inventory="false"
          :itemSlotClasses="
            ingredient && ingredient.itemSlotClasses
              ? ingredient.itemSlotClasses
              : null
          "
          :iconClasses="
            ingredient && ingredient.iconClasses ? ingredient.iconClasses : null
          "
          class="margin-left-2 margin-right-2 relative"
        >
          <div
            class="ingredient-count absolute font-size-18 font-size-18 font-weight-700 flex flex-end"
          >
            <span
              :class="
                ingredient.quantity < ingredient.ingredientCount
                  ? 'ingredient-missing'
                  : ''
              "
              >{{ ingredient.quantity }}</span
            >/{{ ingredient.ingredientCount }}
          </div>
        </Loot>
      </div>
      <!-- arrow -->
      <div class="nav-arrow"></div>
      <!-- achievement -->
      <Loot
        :item="item"
        :inventory="false"
        :itemSlotClasses="item.itemSlotClasses ? item.itemSlotClasses : null"
        :iconClasses="item.iconClasses ? item.iconClasses : null"
        class="margin-left-2 margin-right-2 relative"
        @hint="craftHandler"
      >
        <div class="achievement-name absolute font-size-20 nowrap uppercase">
          {{ item.name }}
        </div>
        <CustomButton
          v-if="false && item.canCraft"
          class="btn-craft"
          type="green"
          @click="craftHandler(item)"
          >{{ $t("btn-craft") }}</CustomButton
        >
      </Loot>
    </div>
  </div>
</template>

<script>
import NetworkRequestErrorMixin from "@/components/NetworkRequestErrorMixin.vue";
import Loot from "@/components/Loot.vue";
import CustomButton from "@/components/Button.vue";

export default {
  components: { Loot, CustomButton },
  mixins: [NetworkRequestErrorMixin],
  props: {
    recipe: Object
  },
  methods: {
    craftHandler(recipe) {
      const items = [];
      for (let i = 0; i < recipe.ingredients.length; i++) {
        const ingredient = recipe.ingredients[i];
        for (let j = 0; j < ingredient.ingredientCount; j++) {
          items.push({ template: ingredient.id, rarity: ingredient.rarity });
        }
      }
      this.$store.commit("lunar/updateState", {
        craftingElementsFromRecipe: items
      });
      this.$router.push({ name: "lunar-craft" });
    }
  }
};
</script>

<style lang="less" scoped>
@import (reference) "../../style/common.less";

.achievement-name {
  left: 50%;
  transform: translate(-50%, -100%);
}
.ingredient-count {
  background: rgba(33, 0, 40, 0.7);
  background: linear-gradient(
    90deg,
    rgba(33, 0, 40, 0) 0%,
    rgba(33, 0, 40, 0.7) 80%,
    rgba(33, 0, 40, 0.3) 100%
  );

  position: absolute;
  bottom: 0.2rem;
  right: 0;
  padding-top: 0.2rem;
  padding-right: 0.6rem;
  left: 0;

  .mobile({bottom: 0.4rem;});
}
.ingredient-missing {
  color: #f00;
}
.btn-craft {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translate(-50%, 0.5rem);
  height: 4rem;
  min-width: 100%;
  margin: 0;
}
.rarity-name {
  background: rgba(0, 0, 0, 0.5);
}
</style>

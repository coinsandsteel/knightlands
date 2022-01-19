<template>
  <div class="width-100 relative recipe padding-bottom-4">
    <Title :stackTop="true">{{ recipe.title }}</Title>

    <div
      v-for="(item, index) in recipe.items"
      :key="index"
      class="flex flex-no-wrap flex-center padding-left-2 padding-right-2 margin-top-4"
    >
      <!-- ingredients -->
      <div class="flex flex-no-wrap">
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
          <div class="ingredient-count absolute font-size-18">
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
      >
        <div class="achievement-name absolute font-size-20 nowrap uppercase">
          {{ item.name }}
        </div>
        <CustomButton
          v-if="item.canCraft"
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
import Title from "@/components/Title.vue";
import Loot from "@/components/Loot.vue";
import CustomButton from "@/components/Button.vue";

export default {
  components: { Title, Loot, CustomButton },
  mixins: [NetworkRequestErrorMixin],
  props: {
    recipe: Object
  },
  methods: {
    craftHandler(recipe) {
      if (!recipe.canCraft) {
        return;
      }

      const items = [];
      for (let i = 0; i < recipe.ingredients.length; i++) {
        const ingredient = recipe.ingredients[i];
        const item = {
          id: ingredient.ingredientId,
          template: ingredient.id,
          rarity: ingredient.rarity,
          caption: ingredient.caption,
          info: { caption: ingredient.caption }
        };
        // eslint-disable-next-line no-console
        console.log("ingredient.rarity", ingredient.rarity);
        for (let j = 0; j < ingredient.ingredientCount; j++) {
          items.push(item);
        }
      }

      this.performRequestNoCatch(this.$store.dispatch("lunar/craft", items));
    }
  }
};
</script>

<style lang="less" scoped>
.achievement-name {
  top: -0.75rem;
  left: 50%;
  transform: translate(-50%, -100%);
}
.ingredient-count {
  bottom: 0.5rem;
  right: 1rem;
  text-shadow: -1px 0 1px #000, 1px 0 1px #000;
  letter-spacing: 1px;
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
</style>

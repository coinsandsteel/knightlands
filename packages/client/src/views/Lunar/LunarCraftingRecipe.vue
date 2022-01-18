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
        />
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
      </Loot>
    </div>
  </div>
</template>

<script>
import Title from "@/components/Title.vue";
import Loot from "@/components/Loot.vue";

export default {
  components: { Title, Loot },
  props: {
    recipe: Object
  }
};
</script>

<style lang="less" scoped>
.achievement-name {
  top: -0.75rem;
  left: 50%;
  transform: translate(-50%, -100%);
}
</style>

<template>
  <div class="width-100 flex relative recipe color-panel-2">
    <Title :stackTop="true" :class="`rarity-${rarity}`">{{ $t(name) }}</Title>

    <div class="full-flex flex flex-center padding-left-2 padding-right-2">
      <Loot :item="item" class="hintFix" @hint="handleHint"></Loot>

      <div
        class="flex height-100 padding-right-1 padding-left-1 flex-center flex-end flex-no-wrap flex-items-center full-flex"
      >
        <crafting-ingridient
          v-for="essence in ingridients"
          :key="essence.itemId"
          :ingridient="essence"
          size="small"
          :hideCount="true"
          :hintHandler="ingridientHintHandler"
          class="margin-right-half"
        />
      </div>
      <CustomButton type="yellow" @click="$emit('craft', recipe)">{{
        $t("btn-preview-craft")
      }}</CustomButton>
    </div>
  </div>
</template>

<script>
import Title from "@/components/Title.vue";
import CustomButton from "@/components/Button.vue";
import HintHandler from "@/components/HintHandler.vue";
import Loot from "@/components/Loot.vue";
import CraftingIngridient from "@/components/CraftingIngridient.vue";

export default {
  props: ["recipe", "ingridientHintHandler"],
  mixins: [HintHandler],
  components: { CustomButton, Loot, CraftingIngridient, Title },
  computed: {
    item() {
      return this.$game.crafting.getResultItem(this.recipe);
    },
    name() {
      return this.$game.itemsDB.getName(this.item);
    },
    rarity() {
      return this.$game.itemsDB.getRarity(this.item);
    },
    ingridients() {
      return this.$game.crafting.getRecipeIngridients(this.recipe);
    }
  }
};
</script>

<style lang="less" scoped>
.recipe {
  height: 112px;
}
</style>

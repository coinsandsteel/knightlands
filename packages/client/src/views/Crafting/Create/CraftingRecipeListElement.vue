<template>
  <div class="flex flex-center relative recipe panel">
    <Loot :item="item" class="hintFix" @hint="handleHint" ></Loot>
    <span class="font-size-20 title" :class="`rarity-${rarity}`">{{$t(name)}}</span>

    <div
      class="flex height-100 padding-right-1 padding-left-1 flex-center flex-end flex-no-wrap flex-items-center full-flex"
    >
      <crafting-ingridient
        v-for="(essence) in ingridients"
        :key="essence.itemId"
        :ingridient="essence"
        size="mini"
        :hideCount="true"
        :hintHandler="ingridientHintHandler"
        class="margin-right-half"
      />
    </div>
    <CustomButton type="yellow" @click="$emit('craft', recipe)">{{$t("btn-preview-craft")}}</CustomButton>
  </div>
</template>

<script>
import CustomButton from "@/components/Button.vue";
import HintHandler from "@/components/HintHandler.vue";
import Loot from "@/components/Loot.vue";
import CraftingIngridient from "@/components/CraftingIngridient.vue";

export default {
  props: ["recipe", "ingridientHintHandler"],
  mixins: [HintHandler],
  components: { CustomButton, Loot, CraftingIngridient },
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
  height: 100px;
  margin: 6px;
  padding: 16px;
}

.title {
  position: absolute;
  top: 0;
}
</style>
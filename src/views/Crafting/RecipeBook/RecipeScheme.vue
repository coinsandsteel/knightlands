<template>
  <div class="flex flex-column flex-center scheme flex-no-wrap flex-space-evenly">
    <div class="flex flex-space-evenly">
      <CraftingIngridient
        v-for="ingridient in ingridients"
        :key="ingridient.itemId"
        :ingridient="ingridient"
        :hintHandler="handleIngridientHint"
        class="margin-left-half margin-right-half"
      ></CraftingIngridient>
    </div>
    <div class="result-arrow"></div>
    <CraftingIngridient
      :ingridient="{itemId:resultItem}"
      :gacha="true"
      :hintHandler="handleIngridientHint"
      :hideCurrentCount="true"
    ></CraftingIngridient>
    <div class="result-arrow" v-if="hasNext"></div>
  </div>
</template>

<script>
import Loot from "@/components/Loot.vue";
import CraftingIngridient from "@/components/CraftingIngridient.vue";

export default {
  props: ["recipe", "hasNext"],
  components: { CraftingIngridient, Loot },
  computed: {
    ingridients() {
      return this.$game.crafting.getRecipeIngridients(this.recipe);
    },
    resultItem() {
      return this.$game.crafting.getResultItem(this.recipe);
    }
  },
  methods: {
    handleIngridientHint(item) {
      this.$emit("hint", item);
    }
  }
};
</script>

<style lang="less" scoped>
.scheme {
  width: 100%;
}

.result-arrow {
  background-image: url("../../../assets/ui/craft_arrow_dark.png");
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
  width: 4rem;
  height: 5rem;
}
</style>
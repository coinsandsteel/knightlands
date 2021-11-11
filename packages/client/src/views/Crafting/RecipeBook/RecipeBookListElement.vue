<template>
  <div class="panel margin-1 flex flex-items-end flex-space-between padding-1">
    <div class="flex flex-column flex-center flex-items-start padding-left-4">
      <span class="font-size-20 margin-bottom-1">{{$t(itemName)}}</span>
      <Loot :item="resultItem" :hideQuantity="true" @hint="handleHint"></Loot>
    </div>
    <CustomButton class="margin-right-4" type="yellow" @click="openPage(page.startRecipe)">Open</CustomButton>
  </div>
</template>

<script>
import Loot from "@/components/Loot.vue";
import CustomButton from "@/components/Button.vue";
import HintHandler from "@/components/HintHandler.vue";

export default {
  props: ["page"],
  mixins: [HintHandler],
  components: { CustomButton, Loot },
  computed: {
    resultItem() {
      return this.$game.crafting.getResultItem(this.page.finalRecipe);
    },
    itemName() {
      return this.$game.itemsDB.getName(this.resultItem);
    }
  },
  methods: {
    openPage(recipeId) {
      this.$router.push({ name: "recipe-book-page", params: { recipeId } });
    }
  }
};
</script>
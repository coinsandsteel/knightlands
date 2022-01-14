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
              <div style="height: 300px;">
                <!-- searchbox -->
                <input
                  type="text"
                  :placeholder="$t('lantern-name')"
                  class="input lantern-name-input white-font margin-bottom-2"
                  aria-describedby="input name input"
                  v-model="searchText"
                  v-on:keyup.enter="searchHandler"
                />
              </div>
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
import LunarCraftingRecipe from "@/views/Lunar/LunarCraftingRecipe.vue";
export default {
  components: {
    LunarCraftingRecipe
  },
  data() {
    return {
      searchText: ""
    };
  },
  computed: {
    recipesList() {
      const item = {
        id: 4,
        isCustomElement: true,
        itemSlotClasses: "lunar-lantern-slot",
        iconClasses: "basic-lantern4",
        name: "Spring Spirit",
        ingredients: [
          {
            id: 1,
            isCustomElement: true,
            itemSlotClasses: "lunar-lantern-slot",
            iconClasses: "basic-lantern1"
          },
          {
            id: 2,
            isCustomElement: true,
            itemSlotClasses: "lunar-lantern-slot",
            iconClasses: "basic-lantern2"
          },
          {
            id: 3,
            isCustomElement: true,
            itemSlotClasses: "lunar-lantern-slot",
            iconClasses: "basic-lantern3"
          }
        ]
      };
      const recipe = {
        title: "Basic",
        items: [item, item, item, item]
      };
      const result = [];

      result.push(recipe);
      result.push({ ...recipe, title: "Advanced" });
      result.push({ ...recipe, title: "Expert" });

      return result;
    }
  },
  methods: {
    searchHandler() {}
  }
};
</script>
<style scoped lang="less"></style>

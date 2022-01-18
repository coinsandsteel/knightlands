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
import { capitalize } from "@/helpers/utils";
import LunarCraftingRecipe from "@/views/Lunar/LunarCraftingRecipe.vue";
import CustomButton from "@/components/Button.vue";

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
        title: capitalize(this.$t("lunar-common")),
        items: [item, item, item, item]
      };
      const result = [];

      result.push(recipe);
      result.push({ ...recipe, title: capitalize(this.$t("lunar-rare")) });
      // result.push({ ...recipe, title: "lunar-epic" });

      return result;
    }
  },
  methods: {
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

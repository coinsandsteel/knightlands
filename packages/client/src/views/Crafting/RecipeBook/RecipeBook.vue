<template>
  <div class="screen-content">
    <div class="screen-background"></div>
    <Tabs :tabs="tabs" :currentTab="currentTab" @onClick="switchTab" />
    <div v-bar>
      <div>
        <RecipeCategory> </RecipeCategory>
      </div>
    </div>
  </div>
</template>

<script>
import AppSection from "@/AppSection.vue";
import RecipeCategory from "./RecipeCategory.vue";
import RecipeBookPages from "@/crafting_book";
import Tabs from "@/components/Tabs.vue";

const MainHands = "main_hands";
const OffHands = "off_hands";
const Armors = "armors";

export default {
  mixins: [AppSection],
  components: { RecipeCategory, Tabs },
  data: () => ({
    pages: RecipeBookPages,
    tabs: [
      { title: MainHands, value: MainHands },
      { title: OffHands, value: OffHands },
      { title: Armors, value: Armors }
    ],
    currentTab: MainHands
  }),
  created() {
    this.title = "window-recipe-book";
    this.$options.useRouterBack = true;
  },
  computed: {
    categories() {
      let categories = [];

      return categories;
    }
  },
  methods: {
    switchTab(tab) {
      this.currentTab = tab;
    }
  }
};
</script>

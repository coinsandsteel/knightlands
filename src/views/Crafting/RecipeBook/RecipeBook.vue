<template>
  <div v-bar>
    <div>
      <RecipeBookListElement v-for="(page, index) in pages" :key="index" :page="page"></RecipeBookListElement>
    </div>
  </div>
</template>

<script>
import AppSection from "@/AppSection.vue";
import RecipeBookListElement from "./RecipeBookListElement.vue";
import RecipeBookPages from "@/crafting_book";

export default {
  mixins: [AppSection],
  components: { RecipeBookListElement },
  data: () => ({
    pages: RecipeBookPages
  }),
  created() {
    this.title = "window-recipe-book";
  }
};
</script>
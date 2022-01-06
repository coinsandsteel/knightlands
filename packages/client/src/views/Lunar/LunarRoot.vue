<template>
  <div class="flex flex-column">
    <div class="screen-background"></div>
    <div class="flex dummy-height flex-no-wrap full-flex flex-column">
      <tabs
        :tabs="tabs"
        :router="true"
        :currentTab="currentTab"
        @onClick="switchTab"
        :replace="true"
      >
      </tabs>
      <router-view v-if="loaded"></router-view>
    </div>
  </div>
</template>

<script>
import Tabs from "@/components/Tabs.vue";
import AppSection from "@/AppSection.vue";

const MatchingAltarTab = "lunar-matching-altar";
const RecipeBookTab = "lunar-recipe-book";

export default {
  mixins: [AppSection],
  components: {
    Tabs
  },
  data() {
    return {
      tabs: [
        {
          title: this.$t("matching-altar"),
          value: MatchingAltarTab,
          to: { name: MatchingAltarTab }
        },
        {
          title: this.$t("recipe-book"),
          value: RecipeBookTab,
          to: { name: RecipeBookTab }
        }
      ],
      currentTab: MatchingAltarTab
    };
  },
  created() {
    this.title = this.$t("window-lunar");
  },
  computed: {
    loaded() {
      return true;
    }
  },
  methods: {
    switchTab(newTab) {
      this.currentTab = newTab;
    }
  }
};
</script>

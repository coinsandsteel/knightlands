<template>
  <div class="relative flex flex-column flex-no-wrap">
    <Tabs
      :replace="true"
      :router="true"
      :tabs="tabs"
      :currentTab="currentTab"
      @onClick="handleTabChanged"
    />
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
import Tabs from "@/components/Tabs.vue";

const DUNGEON = "dungeon";
const DUNGEON_RAIDS = "dungeon-raids";
const DUNGEON_RANKINGS = "dungeon-rankings";

export default {
  mixins: [],
  components: {
    Tabs
  },
  created() {
    this.title = this.$t("dungeon");
  },
  data: () => ({
    tabs: [
      {
        title: DUNGEON,
        to: {
          name: DUNGEON
        }
      },
      {
        title: DUNGEON_RAIDS,
        to: {
          name: DUNGEON_RAIDS
        }
      },
      {
        title: DUNGEON_RANKINGS,
        to: {
          name: DUNGEON_RANKINGS
        }
      }
    ],
    currentTab: DUNGEON
  }),
  computed: {
  },
  methods: {
    handleTabChanged(tab) {
      this.currentTab = tab;
    }
  }
};
</script>

<template>
  <div class="screen-content">
    <Tabs :tabs="tabs" :router="true" :currentTab="currentTab" @onClick="switchTab" :replace="true"></Tabs>

    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
import AppSection from "@/AppSection.vue";
import Tabs from "@/components/Tabs.vue";

const RanksTab = "ranks";
const RewardsTab = "rewards";

export default {
  mixins: [AppSection],
  components: { Tabs },
  created() {
    this.title = "window-tournament-view";
    this.$options.useRouterBack = true;
  },
  data: () => ({
    tabs: [
      { title: "ranks", value: RanksTab, to: { name: "tournament-ranks" } },
      {
        title: "rewards",
        value: RewardsTab,
        to: { name: "tournament-rewards" }
      }
    ],
    currentTab: RanksTab
  }),
  methods: {
    switchTab(newTab) {
      this.currentTab = newTab;
    }
  }
};
</script>
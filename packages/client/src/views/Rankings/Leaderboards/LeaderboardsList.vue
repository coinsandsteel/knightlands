<template>
  <div class="screen-content">
    <div class="screen-background"></div>
    <Tabs :replace="true" :router="true" :tabs="tabs" :currentTab="currentTab">
    </Tabs>
    <router-view></router-view>
  </div>
</template>

<script>
import AppSection from "@/AppSection.vue";
import LeaderboardsMeta from "@/leaderboards_meta";
import Tabs from "@/components/Tabs.vue";

export default {
  mixins: [AppSection],
  components: { Tabs },
  data: () => ({
    tabs: [],
    currentTab: LeaderboardsMeta[0].type
  }),
  created() {
    this.title = "window-leaderboards";
    this.$options.useRouterBack = true;
    this.tabs = LeaderboardsMeta.map(x => {
      return {
        title: "",
        value: x.type,
        icon: x.icon,
        to: { name: "leaderboard-view", params: { id: x.type } }
      };
    });
  }
};
</script>

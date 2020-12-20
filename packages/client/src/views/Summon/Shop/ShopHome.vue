<template>
  <div class="screen-content">
    <div class="screen-background"></div>

    <Tabs :tabs="tabs" @onClick="handleTab" :currentTab="currentTab" />

    <keep-alive>
      <component :is="currentTabComponent"></component>
    </keep-alive>
  </div>
</template>

<script>
import Tabs from "@/components/Tabs.vue";
import AppSection from "@/AppSection.vue";

import ShopTopUp from "./ShopTopUp.vue";

const TabIds = {
  TopUp: "s-top-up",
  Subscription: "s-sub",
  Packs: "s-packs",
  Daily: "s-daily"
};

export default {
  mixins: [AppSection],
  created() {
    this.title = "w-shop";
  },
  components: {
    Tabs,
    ShopTopUp
  },
  data: () => ({
    currentTabComponent: "",
    currentTab: TabIds.Daily,
    tabs: [
      {
        title: TabIds.Daily,
        value: TabIds.Daily
      },
      {
        title: TabIds.Packs,
        value: TabIds.Packs
      },
      {
        title: TabIds.TopUp,
        value: TabIds.TopUp
      },
      {
        title: TabIds.Subscription,
        value: TabIds.Subscription
      }
    ]
  }),
  methods: {
    handleTab(newTab) {
      this.currentTab = newTab;

      switch (newTab) {
        case TabIds.TopUp:
          this.currentTabComponent = "ShopTopUp";
          break;
      }
    }
  }
};
</script>

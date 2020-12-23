<template>
  <div class="screen-content">
    <div class="screen-background"></div>

    <Tabs
      :tabs="tabs"
      @onClick="handleTab"
      :currentTab="currentTab"
      :router="true"
      :replace="true"
    />

    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
import Tabs from "@/components/Tabs.vue";
import AppSection from "@/AppSection.vue";

const TabIds = {
  TopUp: "s-top-up",
  Subscription: "s-sub",
  Packs: "s-packs",
  Daily: "s-daily",
  Gold: "s-gold"
};

export default {
  mixins: [AppSection],
  created() {
    this.title = "w-shop";
  },
  components: {
    Tabs
  },
  data: () => ({
    currentTab: TabIds.Daily,
    tabs: [
      {
        title: TabIds.Daily,
        value: TabIds.Daily,
        to: { name: "daily-shop" }
      },
      {
        title: TabIds.Packs,
        value: TabIds.Packs,
        to: { name: "packs" }
      },
      {
        title: TabIds.TopUp,
        value: TabIds.TopUp,
        to: {
          name: "top-up"
        }
      },
      {
        title: TabIds.Subscription,
        value: TabIds.Subscription,
        to: { name: "sub-shop" }
      },
      {
        title: TabIds.Gold,
        value: TabIds.Gold,
        to: { name: "shop-gold" }
      }
    ]
  }),
  methods: {
    handleTab(newTab) {
      this.currentTab = newTab;
    }
  }
};
</script>

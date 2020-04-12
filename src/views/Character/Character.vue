<template>
  <div class="flex flex-column">
    <div class="flex dummy-height flex-no-wrap full-flex flex-column">
      <tabs :tabs="tabs" :router="true" :currentTab="currentTab" @onClick="switchTab" :replace="true"/>
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </div>
  </div>
</template>

<script>
import AppSection from "@/AppSection.vue";

const InventoryTab = "character";
const StatsTab = "character-training";
const BuffsTab = "character-buffs";
const BeastsTab = "character-beast";

export default {
  mixins: [AppSection],
  components: {
    Tabs: () => import("@/components/Tabs.vue")
  },
  data() {
    return {
      tabs: [
        { title: "inventory", value: InventoryTab, to: "/character/inventory" },
        { title: "training", value: StatsTab, to: "/character/training" },
        { title: "buffs", value: BuffsTab, to: "/character/buffs" },
        { title: "beast", value: BeastsTab, to: "/character/beast" }
      ],
      currentTab: InventoryTab,
      InventoryTab: InventoryTab,
      StatsTab: StatsTab,
      BuffsTab: BuffsTab,
      BeastsTab: BeastsTab
    };
  },
  mounted() {
    this.title = `Character`;
    this.$options.useRouterBack = true;
  },
  methods: {
    switchTab(newTab) {
      this.currentTab = newTab;
    }
  }
};
</script>

<!--Rest of the style-->
<style lang="less">
@import "./style.less";
</style>


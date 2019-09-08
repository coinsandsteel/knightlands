<template>
  <div class="flex flex-column">
    <div class="flex dummy-height flex-no-wrap full-flex flex-column">
      <tabs :tabs="tabs" :currentTab="currentTab" @onClick="switchTab" />
      <keep-alive>
        <inventory v-if="currentTab === InventoryTab" :items="$game.inventory.items"></inventory>
        <stats v-if="currentTab === StatsTab"></stats>
      </keep-alive>
    </div>
  </div>
</template>

<script>
import Tabs from "@/components/Tabs.vue";
import Inventory from "./Inventory.vue";
import Stats from "./Stats.vue";
import AppSection from "@/AppSection";

const InventoryTab = "inventory";
const StatsTab = "stats";

export default {
  mixins: [AppSection],
  components: {
    Tabs,
    Stats,
    Inventory
  },
  data() {
    return {
      tabs: [
        { title: "inventory", value: InventoryTab, to: "/character/inventory" },
        { title: "training", value: StatsTab, to: "/character/stats" }
      ],
      currentTab: InventoryTab,
      InventoryTab: InventoryTab,
      StatsTab: StatsTab
    };
  },
  mounted() {
    this.title = `Character of ${this.$game.shortAccount()}`;
  },
  methods: {
    switchTab(newTab) {
      this.currentTab = newTab;
    }
  }
};
</script>

<!--Rest of the style-->
<style lang="less" scoped>
@import "./style.less";
</style>


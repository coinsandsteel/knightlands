<template>
  <div class="flex flex-column">
    <div class="flex flex-no-wrap full-flex flex-column">
      <tabs
        :tabs="tabs"
        :currentTab="currentTab"
        :wrapper-class="'disabled-tabs'"
        :tab-class="'disabled-tabs__item'"
        :tab-active-class="'disabled-tabs__item_active'"
        :line-class="'disabled-tabs__active-line'"
        @onClick="switchTab"
      />
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
    this.title = `Character of ${this.$game.account.substr(
      0,
      4
    )}...${this.$game.account.substr(-4)}`;
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


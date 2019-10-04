<template>
  <div class="flex flex-column">
    <div class="flex dummy-height flex-no-wrap full-flex flex-column">
      <tabs :tabs="tabs" :currentTab="currentTab" @onClick="switchTab" />
      <keep-alive>
        <inventory v-if="currentTab === InventoryTab" :items="$game.inventory.items"></inventory>
        <stats v-if="currentTab === StatsTab"></stats>
        <Buffs v-if="currentTab === BuffsTab"></Buffs>
        <Beasts v-if="currentTab === BeastsTab"></Beasts>
      </keep-alive>
    </div>
  </div>
</template>

<script>
import Tabs from "@/components/Tabs.vue";
import Inventory from "./Inventory.vue";
import Stats from "./Stats.vue";
import Buffs from "./Buffs/Buffs.vue";
import Beasts from "./BeastTaming/BeastTaming.vue";
import AppSection from "@/AppSection";

const InventoryTab = "inventory";
const StatsTab = "stats";
const BuffsTab = "buffs";
const BeastsTab = "beasts";

export default {
  mixins: [AppSection],
  components: {
    Tabs,
    Stats,
    Inventory,
    Buffs,
    Beasts
  },
  data() {
    return {
      tabs: [
        { title: "inventory", value: InventoryTab, to: "/character/inventory" },
        { title: "training", value: StatsTab, to: "/character/stats" },
        { title: "buffs", value: BuffsTab, to: "/character/buffs" },
        { title: "beast", value: BeastsTab, to: "/character/beasts" },
      ],
      currentTab: InventoryTab,
      InventoryTab: InventoryTab,
      StatsTab: StatsTab,
      BuffsTab: BuffsTab,
      BeastsTab: BeastsTab
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
<style lang="less">
@import "./style.less";
</style>


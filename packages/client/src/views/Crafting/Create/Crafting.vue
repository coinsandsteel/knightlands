<template>
  <div class="screen-content">
    <div class="screen-background"></div>
    <Tabs :tabs="tabs" :currentTab="currentTab" @onClick="handleTab"></Tabs>
    <keep-alive>
      <component :is="currentTab"></component>
    </keep-alive>
  </div>
</template>

<script>
import Tabs from "@/components/Tabs.vue";
import TabHandler from "@/components/TabHandler.vue";
import EquipmentCrafting from "./EquipmentCrafting.vue";
import ConsumablesCrafting from "./ConsumablesCrafting.vue";
import MiscCrafting from "./MiscCrafting.vue";

import AppSection from "@/AppSection.vue";

const TabNames = {
  equipment: "equipmentCrafting",
  consumables: "consumablesCrafting",
  misc: "miscCrafting"
};

export default {
  mixins: [TabHandler, AppSection],
  components: { Tabs, EquipmentCrafting, ConsumablesCrafting, MiscCrafting },
  tabNames: TabNames,
  data: () => ({}),
  created() {
    this.title = "window-crafting";
    this.$options.useRouterBack = true;

    for (let i in TabNames) {
      this.tabs.push({
        title: TabNames[i],
        value: TabNames[i]
      });
    }

    this.currentTab = TabNames.equipment;
  }
};
</script>

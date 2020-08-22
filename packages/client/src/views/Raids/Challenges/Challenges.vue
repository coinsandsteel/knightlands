<template>
  <div class="content">
    <div class="height-100 flex-no-wrap flex flex-column flex center">
      <Tabs :tabs="tabs" :currentTab="currentTab" @onClick="switchTab"></Tabs>
      <div
        class="padding-top-2 height-100 flex-no-wrap flex flex-column flex center width-100"
      >
        <keep-alive>
          <component
            :data="raidState.challenges[currentTab]"
            :raidState="raidState"
            :is="currentTab"
          ></component>
        </keep-alive>
      </div>
    </div>
  </div>
</template>

<script>
import Tabs from "@/components/Tabs.vue";
import UserDialog from "@/components/UserDialog.vue";
import RaidChallenge from "@/../../knightlands-shared/raid_challenge";
import TopDamageDealers from "./TopDamageDealers.vue";

const InventoryTab = "inventory";
const ChestsTab = "open-chests";

export default {
  props: ["raidState"],
  components: { Tabs, TopDamageDealers, UserDialog },
  data: () => ({
    currentTab: "",
    tabs: []
  }),
  mounted() {
    this.components = [];

    for (let type in this.raidState.challenges) {
      if (!type || type == "undefined") {
        continue;
      }

      this.tabs.push({
        title: type,
        value: type
      });
    }

    this.currentTab = this.tabs[0].value;
  },
  methods: {
    switchTab(newTab) {
      this.currentTab = newTab;
    }
  }
};
</script>

<style lang="less" scoped>
.content {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  z-index: 10;
}
</style>

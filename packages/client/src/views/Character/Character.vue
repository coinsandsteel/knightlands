<template>
  <div class="flex flex-column">
    <div class="screen-background"></div>
    <div class="flex dummy-height flex-no-wrap full-flex flex-column">
      <tabs
        :tabs="tabs"
        :router="true"
        :currentTab="currentTab"
        @onClick="switchTab"
        :replace="true"
      >
        <template v-slot:slot3>
          <TrainingMarker class="marker-pos" />
        </template>
      </tabs>
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </div>
  </div>
</template>

<script>
import AppSection from "@/AppSection.vue";
import Tabs from "@/components/Tabs.vue";
import TrainingMarker from "@/components/Markers/Character/TrainingMarker.vue";

const EquipmentTab = "equipment";
const StatsTab = "training";
const BuffsTab = "buffs";
const MiscTab = "misc";

export default {
  mixins: [AppSection],
  components: {
    Tabs,
    TrainingMarker
  },
  data() {
    return {
      tabs: [
        { title: "equipment", value: EquipmentTab, to: { name: "equipment" } },
        { title: "buffs", value: BuffsTab, to: { name: "character-buffs" } },
        { title: "misc", value: MiscTab, to: { name: "character-misc" } },
        {
          title: "training",
          value: StatsTab,
          to: { name: "character-training" }
        }
      ],
      currentTab: EquipmentTab
    };
  },
  created() {
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

.marker-pos {
  position: absolute;
  right: 0;
  top: 0;
}
</style>

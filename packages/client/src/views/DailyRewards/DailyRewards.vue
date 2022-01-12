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
//import TrainingMarker from "@/components/Markers/Character/TrainingMarker.vue";

const ItemTab = "item";
const LunarTab = "lunar";

export default {
  mixins: [AppSection],
  components: {
    Tabs,
    //TrainingMarker
  },
  data() {
    return {
      tabs: [
        { title: "item", value: ItemTab, to: { name: "item" } },
        { title: "lunar", value: LunarTab, to: { name: "lunar" } },
      ],
      currentTab: ItemTab
    };
  },
  created() {
    this.title = `Daily Reward`;
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

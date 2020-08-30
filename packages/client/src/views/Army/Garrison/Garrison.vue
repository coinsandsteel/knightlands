<template>
  <div class="screen-content">
      <div class="screen-background"></div>
    <Tabs
      :tabs="tabs"
      :router="true"
      :currentTab="currentTab"
      @onClick="switchTab"
      :replace="true"
    ></Tabs>

    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
import Tabs from "@/components/Tabs.vue";
import AppSection from "@/AppSection.vue";

const Reserve = "reserve";
const Dismiss = "dismiss";

export default {
  mixins: [AppSection],
  components: { Tabs },
  data: () => ({
    tabs: [
      {
        title: "window-banishment",
        value: Dismiss,
        to: { name: "units-dismiss" }
      },
      {
        title: "window-reserve",
        value: Reserve,
        to: { name: "units-reserve" }
      }
    ],
    currentTab: Dismiss
  }),
  created() {
    this.$options.useRouterBack = true;
  },
  methods: {
    switchTab(newTab) {
      this.currentTab = newTab;
    }
  }
};
</script>

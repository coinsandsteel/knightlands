<template>
  <div class="screen-content">
    <div class="screen-background"></div>
    <div v-bar>
      <div>
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
    </div>
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
        title: "w-banish",
        value: Dismiss,
        to: { name: "units-dismiss" }
      },
      {
        title: "w-reserve",
        value: Reserve,
        to: { name: "units-reserve" }
      }
    ],
    currentTab: Dismiss
  }),
  created() {
    this.title = "w-garr";
    this.$options.useRouterBack = true;
  },
  methods: {
    switchTab(newTab) {
      this.currentTab = newTab;
    }
  }
};
</script>

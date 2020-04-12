<template>
  <div class="flex flex-column">
    <Tabs :tabs="tabs" :currentTab="currentTab" @onClick="handleTab"></Tabs>
    <keep-alive>
        <DailyLogin v-if="currentTab == DailyLoginTab"></DailyLogin>
        <DailyRefills v-if="currentTab == DailyRefillTab"></DailyRefills>
    </keep-alive>
  </div>
</template>

<script>
import AppSection from "@/AppSection.vue";
import Tabs from "@/components/Tabs.vue";
import TabHandler from "@/components/TabHandler.vue";
import DailyLogin from "./DailyLogin.vue";
import DailyRefills from "./DailyRefills.vue";

const DailyLoginTab = "daily_login";
const DailyRefillTab = "daily_refill";

export default {
  mixins: [AppSection, TabHandler],
  components: { Tabs, DailyLogin, DailyRefills },
  data: () => ({
      DailyLoginTab,
      DailyRefillTab
  }),
  created() {
    this.tabs = [
      { title: "daily_login", value: DailyLoginTab },
      { title: "daily_refill", value: DailyRefillTab }
    ];
    this.currentTab = DailyLoginTab;
  }
};
</script>
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
      </tabs>
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { create } from "vue-modal-dialogs";
import Tabs from "@/components/Tabs.vue";
import AppSection from "@/AppSection.vue";
import NetworkRequestErrorMixin from "@/components/NetworkRequestErrorMixin.vue";

const PlayTab = "may-play";
const RankingsTab = "may-rankings";

export default {
  mixins: [AppSection, NetworkRequestErrorMixin],
  components: {
    Tabs
  },
  data() {
    return {
      hasShowDailyRewards: false,
      tabs: [
        {
          title: this.$t("event-menu"),
          value: PlayTab,
          to: { name: PlayTab }
        },
        {
          title: this.$t("rating"),
          value: RankingsTab,
          to: { name: RankingsTab }
        }
      ],
      currentTab: PlayTab
    };
  },
  async mounted() {
    this.$store.dispatch("may/subscribe");
    await this.$store.dispatch("may/load");
  },
  methods: {
    switchTab(newTab) {
      this.currentTab = newTab;
    }
  }
};
</script>
<style scoped lang="less"></style>

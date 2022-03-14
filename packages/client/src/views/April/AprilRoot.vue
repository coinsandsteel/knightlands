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
import { mapState } from "vuex";
import { create } from "vue-modal-dialogs";
import Tabs from "@/components/Tabs.vue";
import AppSection from "@/AppSection.vue";
import NetworkRequestErrorMixin from "@/components/NetworkRequestErrorMixin.vue";
import AprilDailyRewards from "@/views/April/AprilDailyRewards.vue";
const PlayTab = "april-play";
const RankingsTab = "april-rankings";

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
  computed: {
    ...mapState("april", ["dailyRewards"])
  },
  created() {
    this.title = this.$t("april-event");
    this.$store.$app.$on("april-show-daily-reward", this.tryToShowRewards);
  },
  destroyed() {
    this.$store.$app.$off("april-show-daily-reward");
  },
  async mounted() {
    this.$store.dispatch("april/subscribe");
    await this.$store.dispatch("april/load");
  },
  beforeDestroy() {
    this.$store.dispatch("april/unsubscribe");
  },
  activated() {
    this.tryToShowRewards();
  },
  methods: {
    switchTab(newTab) {
      this.currentTab = newTab;
    },
    tryToShowRewards() {
      if (
        this.dailyRewards &&
        this.dailyRewards.find(({ active, collected }) => active && !collected)
      ) {
        // @todo: uncomment
        // this.showDailyRewards();
      }
    },
    async showDailyRewards() {
      if (this.hasShowDailyRewards) {
        return;
      }
      this.hasShowDailyRewards = true;
      const showDailyRewardsDialog = create(AprilDailyRewards);
      await showDailyRewardsDialog();
      this.hasShowDailyRewards = false;
    }
  }
};
</script>

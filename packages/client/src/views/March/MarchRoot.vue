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
// import CustomButton from "@/components/Button.vue";
import NetworkRequestErrorMixin from "@/components/NetworkRequestErrorMixin.vue";
import MarchDailyRewards from "@/views/March/MarchDailyRewards.vue";
const PlayTab = "march-play";
const PetsTab = "march-pets";
const RankingsTab = "march-rankings";

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
          title: this.$t("Event Menu???"),
          value: PlayTab,
          to: { name: PlayTab }
        },
        {
          title: this.$t("Pets???"),
          value: PetsTab,
          to: { name: PetsTab }
        },
        {
          title: this.$t("Rating???"),
          value: RankingsTab,
          to: { name: RankingsTab }
        }
      ],
      currentTab: PlayTab
    };
  },
  computed: {
    ...mapState("march", ["dailyRewards"])
  },
  created() {
    this.title = this.$t("window-march???");
    this.$store.$app.$on("march-show-daily-reward", this.tryToShowRewards);
  },
  destroyed() {
    this.$store.$app.$off("march-show-daily-reward");
  },
  async mounted() {
    this.$store.dispatch("march/subscribe");
    await this.$store.dispatch("march/load");
  },
  beforeDestroy() {
    this.$store.dispatch("march/unsubscribe");
  },
  activated() {
    this.tryToShowRewards();
  },
  methods: {
    switchTab(newTab) {
      this.currentTab = newTab;
    },
    tryToShowRewards() {
      // console.log("march root: this.dailyRewards", [...this.dailyRewards]);
      if (
        this.dailyRewards &&
        this.dailyRewards.find(({ active, collected }) => active && !collected)
      ) {
        this.showDailyRewards();
      }
    },
    async showDailyRewards() {
      if (this.hasShowDailyRewards) {
        return;
      }
      this.hasShowDailyRewards = true;
      const showDailyRewardsDialog = create(MarchDailyRewards);
      await showDailyRewardsDialog();
      this.hasShowDailyRewards = false;
    }
  }
};
</script>
<style scoped lang="less"></style>

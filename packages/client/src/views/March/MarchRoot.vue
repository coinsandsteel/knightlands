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
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
// import { mapState } from "vuex";
import { create } from "vue-modal-dialogs";
import Tabs from "@/components/Tabs.vue";
import AppSection from "@/AppSection.vue";
// import CustomButton from "@/components/Button.vue";
import NetworkRequestErrorMixin from "@/components/NetworkRequestErrorMixin.vue";
import MarchDailyRewards from "@/views/March/MarchDailyRewards.vue";
const PlayTab = "march-play";
const PetsTab = "march-pets";
const RatingTab = "march-rating";

export default {
  mixins: [AppSection, NetworkRequestErrorMixin],
  components: {
    Tabs
  },
  data() {
    return {
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
          value: RatingTab,
          to: { name: RatingTab }
        }
      ],
      currentTab: PlayTab
    };
  },
  created() {
    this.title = this.$t("window-march???");
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
      // if (
      //   this.dailyRewards &&
      //   this.dailyRewards.find(({ active, collected }) => active && !collected)
      // ) {
      //   this.showDailyRewards();
      // }
      // this.showDailyRewards();
    },
    showDailyRewards() {
      const showDailyRewardsDialog = create(MarchDailyRewards);
      showDailyRewardsDialog();
    }
  }
};
</script>
<style scoped lang="less"></style>

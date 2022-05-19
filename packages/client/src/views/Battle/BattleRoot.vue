<template>
  <div class="flex flex-column">
    <div class="screen-background"></div>
    <div
      class="flex dummy-height flex-no-wrap full-flex flex-column overflow-auto"
    >
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
// import { create } from "vue-modal-dialogs";
import Tabs from "@/components/Tabs.vue";
import AppSection from "@/AppSection.vue";
import BattleDailyRewards from "@/views/Battle/BattleDailyRewards.vue";
import NetworkRequestErrorMixin from "@/components/NetworkRequestErrorMixin.vue";

const MenuTab = "battle-menu";
const AchievementTab = "battle-achievement";
const RankingsTab = "battle-rankings";

export default {
  mixins: [AppSection, NetworkRequestErrorMixin],
  components: {
    Tabs
  },
  computed: {
    ...mapGetters("april", ["dailyRewards"])
  },
  data() {
    return {
      hasShowDailyRewards: false,
      tabs: [
        {
          title: this.$t("event-menu"),
          value: MenuTab,
          to: { name: MenuTab }
        },
        {
          title: this.$t("achievement"),
          value: AchievementTab,
          to: { name: AchievementTab }
        },
        {
          title: this.$t("rating"),
          value: RankingsTab,
          to: { name: RankingsTab }
        }
      ],
      currentTab: MenuTab
    };
  },
  created() {
    this.title = this.$t("april-event");
    this.$store.$app.$on("april-show-daily-reward", this.tryToShowRewards);
  },
  destroyed() {
    this.$store.$app.$off("april-show-daily-reward");
  },
  async mounted() {
    this.$store.dispatch("april/subscribe"); // @todo remove april
    await this.$store.dispatch("april/load");
    this.$store.dispatch("battle/subscribe");
    await this.$store.dispatch("battle/load");
  },
  beforeDestroy() {
    this.$store.dispatch("april/unsubscribe");
    this.$store.dispatch("battle/unsubscribe");
  },
  activated() {
    this.tryToShowRewards();
  },
  methods: {
    switchTab(newTab) {
      this.currentTab = newTab;
    },
    handleBackButton() {
      console.log("handleBackButton");
      // this.$router.back();
      this.$router.replace({ name: "battle-menu" });

      return true;
    },
    tryToShowRewards() {
      console.log("tryToShowRewards", this.dailyRewards);
      if (
        this.dailyRewards &&
        this.dailyRewards.find(({ active, collected }) => active && !collected)
      ) {
        this.showDailyRewards();
      }
    },
    async showDailyRewards() {
      console.log("showDailyRewards", this.hasShowDailyRewards);
      if (this.hasShowDailyRewards) {
        return;
      }
      this.hasShowDailyRewards = true;
      const showDailyRewardsDialog = create(BattleDailyRewards);
      await showDailyRewardsDialog();
      this.hasShowDailyRewards = false;
    }
  }
};
</script>
<style scoped lang="less"></style>

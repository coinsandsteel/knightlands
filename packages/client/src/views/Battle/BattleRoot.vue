<template>
  <div v-if="loaded" class="flex flex-column">
    <div class="screen-background"></div>
    <div
      class="flex dummy-height flex-no-wrap full-flex flex-column overflow-auto"
    >
      <tabs
        v-if="isTabsVisible"
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

    <!-- <Tutorial ref="tutorial" :scenario="tutorialScenario" :state="{'step':0, 'conditionPassed': true, 'actionIndex': 0}" /> -->
  </div>
</template>
<script>
// import { mapGetters } from "vuex";
// import { create } from "vue-modal-dialogs";
// import { create } from "vue-modal-dialogs";
import { mapState } from "vuex";
import Tabs from "@/components/Tabs.vue";
// import AppSection from "@/AppSection.vue";
// import BattleDailyRewards from "@/views/Battle/BattleDailyRewards.vue";
import BattleMixin from "@/views/Battle/BattleMixin.vue";
// import NetworkRequestErrorMixin from "@/components/NetworkRequestErrorMixin.vue";

const MenuTab = "battle-menu";
const AchievementTab = "battle-achievement";
const RankingsTab = "battle-rankings";

export default {
  // mixins: [AppSection, NetworkRequestErrorMixin],
  mixins: [BattleMixin],
  components: {
    Tabs
  },
  data() {
    return {
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
  computed: {
    ...mapState("battle", ["loaded"]),
    isTabsVisible() {
      return ["battle-menu", "battle-achievement", "battle-rankings"].includes(
        this.$route.name
      );
      // return ![
      //   "battle-units",
      //   "battle-squad-home",
      //   "battle-squad-warehouse",
      //   "battle-squad-bonus",
      //   "battle-squad-unit",
      //   "battle-duels-play",
      //   "battle-adventure-play"
      // ].includes(this.$route.name);
    }
  },
  created() {
    this.$options.useRouterBack = true;
    // this.title = this.$t("battle-event");
    // this.$store.$app.$on("battle-show-daily-reward", this.tryToShowRewards);
  },
  activated() {
    this.checkAndRedirectToBattle();
  },
  // destroyed() {
  //   this.$store.$app.$off("battle-show-daily-reward");
  // },
  // async mounted() {
  //   this.$store.dispatch("battle/subscribe");
  //   await this.$store.dispatch("battle/load");
  // },
  // beforeDestroy() {
  //   this.$store.dispatch("battle/unsubscribe");
  // },
  // activated() {
  //   this.tryToShowRewards();
  // },
  methods: {
    switchTab(newTab) {
      this.currentTab = newTab;
    },
    handleBackButton() {
      this.$router.replace({ name: "battle-menu" });

      return true;
    }
  }
};
</script>


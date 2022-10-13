<script>
import { mapGetters, mapState } from "vuex";
// import { create } from "vue-modal-dialogs";
import AppSection from "@/AppSection.vue";
// import BattleDailyRewards from "@/views/Battle/BattleDailyRewards.vue";
import NetworkRequestErrorMixin from "@/components/NetworkRequestErrorMixin.vue";

export default {
  mixins: [AppSection, NetworkRequestErrorMixin],
  computed: {
    ...mapState("battle", ["loaded", "hasSubscribed", "hasShownDailyRewards"]),
    ...mapGetters("battle", ["dailyRewards"])
  },
  created() {
    // this.$store.$app.$on("battle-show-daily-reward", this.tryToShowRewards);
  },
  destroyed() {
    // this.$store.$app.$off("battle-show-daily-reward");
  },
  async mounted() {
    if (!this.hasSubscribed) {
      this.$store.dispatch("battle/subscribe");
    }
    if (!this.loaded) {
      await this.$store.dispatch("battle/load");
    }
  },
  activated() {
    // this.tryToShowRewards();
  },
  methods: {
    // tryToShowRewards() {
    //   if (
    //     this.dailyRewards &&
    //     this.dailyRewards.find(({ active, collected }) => active && !collected)
    //   ) {
    //     this.showDailyRewards();
    //   }
    // },
    // async showDailyRewards() {
    //   if (this.hasShownDailyRewards) {
    //     return;
    //   }
    //   this.$store.dispatch("battle/update", { hasShownDailyRewards: true });
    //   const showDailyRewardsDialog = create(BattleDailyRewards);
    //   await showDailyRewardsDialog();
    //   this.$store.dispatch("battle/update", { hasShownDailyRewards: false });
    // }
  }
};
</script>

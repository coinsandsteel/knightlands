<script>
import LeaderboardView from "../Components/LeaderboardView.vue";
import AppSection from "@/AppSection.vue";

export default {
  mixins: [AppSection],
  extends: LeaderboardView,
  mounted() {
    this.title = this.$t(`l-type-${this.id}`);
    this.$options.useRouterBack = true;
  },
  methods: {
    async getRank(rankingId) {
      return await this.$game.getLeaderboardRank(rankingId);
    },
    async fetchRankings(rankingId, page) {
      return await this.$game.getLeaderboardRankings(rankingId, page);
    }
  }
};
</script>

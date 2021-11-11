<script>
import LeaderboardView from "../Components/LeaderboardView.vue";

export default {
  extends: LeaderboardView,
  mounted() {
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

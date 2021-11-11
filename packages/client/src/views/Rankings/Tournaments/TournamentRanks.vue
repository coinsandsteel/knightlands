<script>
import LeaderboardView from "../Components/LeaderboardView.vue";

export default {
  extends: LeaderboardView,
  methods: {
    async getRank(rankingId) {
      return await this.$game.getTournamentInfo(rankingId);
    },
    async fetchRankings(rankingId, page) {
      return await this.$game.fetchTournamentRankings(rankingId, page);
    }
  }
};
</script>
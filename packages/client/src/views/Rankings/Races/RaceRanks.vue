<script>
import LeaderboardView from "../Components/LeaderboardView.vue";
import { create } from "vue-modal-dialogs";
import RaceInfo from "./RaceInfo.vue";

const infoWindow = create(RaceInfo);

export default {
  extends: LeaderboardView,
  created() {
    this.showInfoButton = true;
  },
  methods: {
    async getRank(rankingId) {
      return await this.$game.getRaceInfo(rankingId);
    },
    async fetchRankings(rankingId, page) {
      return await this.$game.fetchRaceRankings(rankingId, page);
    },
    async openInfo() {
      await infoWindow({
        race: this.currentRank
      });
    }
  }
};
</script>

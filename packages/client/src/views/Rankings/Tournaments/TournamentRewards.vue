<script>
import RankedRewards from "../Components/RankedRewards.vue";

export default {
  extends: RankedRewards,
  async mounted() {
    this.currentRank = await this.$game.getTournamentInfo(this.id);
    this.rewards = await this.$game.getTournamentRewards(this.id);
  }
};
</script>

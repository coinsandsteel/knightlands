<script>
import RankedRewards from "../Components/RankedRewards.vue";

export default {
  extends: RankedRewards,
  async mounted() {
    this.currentRank = await this.$game.getRaceInfo(this.id);
    this.rewards = await this.$game.getRaceRewards(this.id);
  }
};
</script>

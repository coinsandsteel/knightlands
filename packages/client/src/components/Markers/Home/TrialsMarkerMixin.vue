<script>
import TowerMeta from "@/tower_meta";

export default {
  data: () => ({
    trialTypes: []
  }),
  mounted() {
    this.towerItem = this.$game.inventory.getItemByTemplate(
      TowerMeta.ticketItem
    );
  },
  computed: {
    canEngageTrial() {
      for (const trialType of this.trialTypes) {
        const state = this.$game.getTrialState(trialType);
        if (state.freeAttempts + state.attempts > 0) {
          return true;
        }
      }

      return false;
    }
  }
};
</script>

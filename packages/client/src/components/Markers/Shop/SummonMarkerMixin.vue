<script>
import ArmySummonType from "@/../../knightlands-shared/army_summon_type";

export default {
  data: () => ({
    summonTypes: [ArmySummonType.Normal, ArmySummonType.Advanced]
  }),
  computed: {
    canSummon() {
      for (const summonType of this.summonTypes) {
        let info = this.$store.state.summon.basicSummon;

        if (summonType == ArmySummonType.Advanced) {
          info = this.$store.state.summon.advancedSummon;
        }

        if (info && info.meta && info.meta.freeOpens > 0) {
          let resetCycle = 86400 / info.meta.freeOpens;
          let timeElapsed = this.$game.nowSec - info.lastSummon;
          if (
            resetCycle - timeElapsed <= 0 ||
            this.$game.inventory.getItemsCountByTemplate(info.meta.ticketItem)
          ) {
            return true;
          }
        }
      }
      return false;
    }
  }
};
</script>

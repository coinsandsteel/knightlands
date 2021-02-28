<script>
import TowerMeta from "@/tower_meta";

export default {
  data: () => ({
    towerItem: null
  }),
  mounted() {
    this.towerItem = this.$game.inventory.getItemByTemplate(
      TowerMeta.ticketItem
    );
  },
  computed: {
    canEngageTower() {
      const towerKeys = this.towerItem ? this.towerItem.count : 0;
      return towerKeys + this.$game.freeAttempts > 0;
    }
  }
};
</script>

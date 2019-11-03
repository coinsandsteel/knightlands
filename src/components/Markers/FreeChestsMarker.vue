<script>
import Marker from "./Marker.vue";
import ChestsMeta from "@/chests_meta";

export default {
  extends: Marker,
  activated() {
    this.fetchStatus();
  },
  mounted() {
    this.fetchStatus();
  },
  methods: {
    async fetchStatus() {
      if (this.requestInProcess) {
        return;
      }

      this.requestInProcess = true;
      const lastChestOpenings = await this.$game.getChestsStatus();
      this.requestInProcess = false;
      this.active = false;

      for (const chestName in ChestsMeta) {
        const freeOpenings = ChestsMeta[chestName].freeOpens;
        if (freeOpenings > 0) {
          let resetCycle = 86400000 / freeOpenings;
          let timeUntilNextFreeOpening =
            this.$game.now - (lastChestOpenings[chestName] || 0);
          const timeLeft = (resetCycle - timeUntilNextFreeOpening) / 1000;
          if (timeLeft < 1) {
            this.active = true;
            return;
          }
        }
      }
    }
  }
};
</script>
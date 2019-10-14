

<script>
import Marker from "./Marker.vue";

export default {
  extends: Marker,
  activated() {
    this.fetchStatus();
  },
  methods: {
    async fetchStatus() {
      const dailyRewardStatus = await this.$game.fetchDailyRewardStatus();
      this.active = dailyRewardStatus.readyToCollect;
    }
  }
};
</script>
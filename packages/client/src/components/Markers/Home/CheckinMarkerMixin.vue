<script>
export default {
  computed: {
    canCollectDailyRewards() {
      return this.$store.state.dailyLogin.readyToCollect;
    },
    canCollectDailyLunarRewards() {
      return this.$store.state.dailyLunarReward.readyToCollect;
    }
  }
};
</script>

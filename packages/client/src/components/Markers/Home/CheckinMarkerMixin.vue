<script>
export default {
  computed: {
    canCollectDailyRewards() {
      return this.$store.state.dailyLogin.readyToCollect;
    }
  }
};
</script>

<script>
export default {
  computed: {
    canCollectAdventures() {
      return this.$store.state.adventures.readyToCollect;
    }
  }
};
</script>

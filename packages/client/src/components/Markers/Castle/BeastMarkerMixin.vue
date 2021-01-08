<script>
import Beasts from "@/beasts";

export default {
  data: () => ({
    beastItem: null
  }),
  mounted() {
    this.beastItem = this.$game.inventory.getItemByTemplate(Beasts.ticketItem);
  },
  computed: {
    beastCanBeBoosted() {
      if (!this.beastItem) {
        return false;
      }
      return (
        this.$game.inventory.getItemByTemplate(Beasts.ticketItem).count > 0
      );
    }
  }
};
</script>

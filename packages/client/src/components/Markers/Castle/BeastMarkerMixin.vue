<script>
import Beasts from "@/beasts";

export default {
  data: () => ({
    item: null
  }),
  mounted() {
    this.item = this.$game.inventory.getItemByTemplate(Beasts.ticketItem);
  },
  computed: {
    beastCanBeBoosted() {
      if (!this.item) {
        return false;
      }
      return (
        this.$game.inventory.getItemByTemplate(Beasts.ticketItem).count > 0
      );
    }
  }
};
</script>

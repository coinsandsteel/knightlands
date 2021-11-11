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
      let beast = this.$game.beast();
      if (
        !this.beastItem ||
        beast.level >= Beasts.levels[beast.index].levels.length
      ) {
        return false;
      }
      return (
        this.$game.inventory.getItemByTemplate(Beasts.ticketItem).count > 0
      );
    }
  }
};
</script>

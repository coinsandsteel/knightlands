<script>
import Inventory from "@/inventory";

export default {
  mounted() {
    this.__changed_cb = this.handleInventoryChanged.bind(this);
    this.$game.inventory.on(Inventory.Changed, this.__changed_cb);
  },
  destroyed() {
    if (this.__changed_cb) {
      this.$game.inventory.off(Inventory.Changed, this.__changed_cb);
      this.__changed_cb = null;
    }
  }
};
</script>

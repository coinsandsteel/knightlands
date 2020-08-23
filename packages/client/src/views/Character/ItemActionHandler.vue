<script>
import CompareItems from "@/components/CompareItems.vue";
import { create as CreateDialog } from "vue-modal-dialogs";
import ItemsReceived from "@/components/ItemsReceived.vue";

const ShowItems = CreateDialog(
  ItemsReceived,
  "items",
  "soft",
  "hard",
  "exp",
  "dkt"
);
const ShowCompareItems = CreateDialog(CompareItems, "leftItem", "rightItem");

export default {
  methods: {
    async handleItemAction(item, action, ...args) {
      switch (action) {
        case "equip":
          this.request = this.$game.equipItem(item.id);
          break;

        case "unequip":
          {
            const itemSlot = this.$game.itemsDB.getSlot(item.template);
            this.request = this.$game.unequipItem(itemSlot);
          }
          break;

        case "use":
          this.request = this.$game.useItem(item.id);
          break;

        case "open":
          {
            let count = args[0] || 1;
            this.request = this.$game.useItem(item.id, count);
            let items = await this.request;
            await ShowItems(items);
          }
          break;

        case "compare":
          await this.compareItems(item);
          break;
      }
    },
    async compareItems(item) {
      const slot = this.$game.itemsDB.getSlot(item.template);
      await ShowCompareItems(this.$character.equipment[slot], item);
    }
  }
};
</script>

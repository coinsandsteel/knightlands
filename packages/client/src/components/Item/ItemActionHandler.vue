<script>
import CompareItems from "@/components/Item/CompareItems.vue";
import { create as CreateDialog } from "vue-modal-dialogs";
import ItemsReceived from "@/components/ItemsReceived.vue";
import ItemEquipWarning from "./ItemEquipWarning.vue";
import UnitSummoned from "./UnitSummoned.vue";

const ShowItems = CreateDialog(
  ItemsReceived,
  "items",
  "soft",
  "hard",
  "exp",
  "dkt"
);
const ShowCompareItems = CreateDialog(CompareItems, "leftItem", "rightItem");
const ShowEquipWarning = CreateDialog(ItemEquipWarning, "item");
const ShowUnitsSummoned = CreateDialog(UnitSummoned, "units");
const ItemActions = require("@/../../knightlands-shared/item_actions");

export default {
  methods: {
    async showEquipWarning(item) {
      return ShowEquipWarning(item);
    },
    async handleItemAction(item, action, ...args) {
      switch (action) {
        case ItemActions.Equip: {
          let equip = true;
          if (item.holder > 0) {
            equip = await this.showEquipWarning(item);
          }

          if (equip) {
            this.request = this.$game.equipItem(item.id);
          }
          break;
        }

        case ItemActions.Unequip:
          {
            const itemSlot = this.$game.itemsDB.getSlot(item.template);
            this.request = this.$game.unequipItem(itemSlot);
          }
          break;

        case ItemActions.Use:
          this.request = this.$game.useItem(item.id);
          break;

        case ItemActions.OpenBox:
          {
            const count = args[0] || 1;
            this.request = this.$game.useItem(item.id, count);
            let items = await this.request;
            await ShowItems(items);
          }
          break;

        case ItemActions.Compare:
          await this.compareItems(item);
          break;

        case ItemActions.SummonUnit:
          {
            const count = args[0] || 1;
            this.request = this.$game.useItem(item.id, count);

            const units = await this.request;
            this.$game.handleArmySummoned(units);
            await ShowUnitsSummoned(units);
          }
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

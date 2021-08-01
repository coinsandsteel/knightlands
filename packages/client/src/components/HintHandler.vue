<script>
import LootHint from "@/components/LootHint.vue";
import { create as CreateDialog } from "vue-modal-dialogs";

const Hint = CreateDialog(
  LootHint,
  "item",
  "equip",
  "unequip",
  "actions",
  "buttons",
  "showButtons",
  "equippedItems",
  "preview"
);

export default {
  methods: {
    async showHint(
      item,
      buttons,
      options = { showButtons: true, actions: { equip: true }, preview: false }
    ) {
      buttons = buttons || [];

      const showButtons =
        options.showButtons == undefined
          ? buttons.length > 0
          : options.showButtons;

      return await Hint(
        item,
        !item.equipped,
        item.equipped,
        options.actions || {},
        buttons,
        showButtons,
        options.equippedItems,
        options.preview
      );
    },
    async handleHint(item) {
      return this.showHint(item, undefined, {});
    },
    async handlePreviewHint(items) {
      return this.showHint(items, [], { preview: true });
    }
  }
};
</script>

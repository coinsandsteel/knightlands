<script>
import LootHint from "@/components/LootHint.vue";
const Hint = CreateDialog(LootHint, "item", "equip", "unequip", "actions", "buttons", "showButtons");
import { create as CreateDialog } from "vue-modal-dialogs";

export default {
  methods: {
    async showHint(item, buttons, showButtons = true) {
      buttons = buttons || [];
      return await Hint(item, !item.equipped, item.equipped, { equip: true }, buttons, showButtons);
    },
    async handleHint(item) {
      return this.showHint(item, undefined, false);
    }
  }
};
</script>
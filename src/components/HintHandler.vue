<script>
import LootHint from "@/components/LootHint.vue";
const Hint = CreateDialog(LootHint, "item", "equip", "unequip", "actions", "buttons", "showButtons");
import { create as CreateDialog } from "vue-modal-dialogs";

export default {
  methods: {
    async showHint(item, buttons) {
      let actions = this.hintActions || { equip: false };
      buttons = buttons || [];
      return await Hint(item, !item.equipped, item.equipped, actions, buttons, buttons.length > 0);
    },
    async handleHint(item) {
      return this.showHint(item);
    }
  }
};
</script>
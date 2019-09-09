<script>
import LootHint from "@/components/LootHint.vue";
const Hint = CreateDialog(LootHint, "item", "equip", "unequip", "actions", "buttons");
import { create as CreateDialog } from "vue-modal-dialogs";

export default {
  methods: {
    async showHint(item, buttons) {
      let actions = this.hintActions || { equip: false };
      buttons = buttons || [];
      return await Hint(item, !item.equipped, item.equipped, actions, buttons);
    },
    async handleHint(item) {
      return this.showHint(item);
    }
  }
};
</script>
<script>
import LootHint from "@/components/LootHint.vue";
const Hint = CreateDialog(LootHint, "item", "equip", "unequip", "actions");
import { create as CreateDialog } from "vue-modal-dialogs";

export default {
  methods: {
    async showHint(item) {
      let actions = this.hintActions || { equip: false };
      return await Hint(item, !item.equipped, item.equipped, actions);
    },
    async handleHint(item) {
      return this.showHint(item);
    }
  }
};
</script>
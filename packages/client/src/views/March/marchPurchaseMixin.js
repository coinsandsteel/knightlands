import { mapState } from "vuex";
import { create } from "vue-modal-dialogs";
import meta from "@/march_meta.json";
import MarchNotEnoughBalance from "@/views/March/MarchNotEnoughBalance.vue";

export default {
  computed: {
    ...mapState("march", ["balance"])
  },
  methods: {
    checkGoldBalance(gold) {
      if (this.balance && this.balance.gold >= gold) {
        return true;
      }
      const showDialog = create(MarchNotEnoughBalance, "type");
      showDialog("gold");
    },
    checkTicketBalance(tickets) {
      const itemsCount =
        this.$game.inventory.getItemsCountByTemplate(meta.marchTicket) || 0;

      if (itemsCount >= tickets) {
        return true;
      }
      const showDialog = create(MarchNotEnoughBalance, "type");
      showDialog("tickets");
    }
  }
};

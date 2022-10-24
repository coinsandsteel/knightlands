import { mapState } from "vuex";
import { create } from "vue-modal-dialogs";
import meta from "@/metadata/april_meta.json";
import AprilNotEnoughBalance from "@/views/April/AprilNotEnoughBalance.vue";

export default {
  computed: {
    ...mapState("april", ["balance"])
  },
  methods: {
    checkGoldBalance(gold) {
      if (this.balance && this.balance.gold >= gold) {
        return true;
      }
      const showDialog = create(AprilNotEnoughBalance, "type");
      showDialog("gold");
    },
    checkTicketBalance(tickets) {
      const itemsCount =
        this.$game.inventory.getItemsCountByTemplate(meta.aprilTicket) || 0;

      if (itemsCount >= tickets) {
        return true;
      }
      const showDialog = create(AprilNotEnoughBalance, "type");
      showDialog("ticket");
    },
    checkPointBalance(points) {
      const itemsCount =
        this.$game.inventory.getItemsCountByTemplate(meta.aprilTicket) || 0;

      if (itemsCount >= points) {
        return true;
      }
      const showDialog = create(AprilNotEnoughBalance, "type");
      showDialog("point");
    }
  }
};

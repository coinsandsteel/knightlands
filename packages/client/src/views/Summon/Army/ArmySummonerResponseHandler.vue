<script>
import PromptMixin from "@/components/PromptMixin.vue";
import NetworkRequestErrorMixin from "@/components/NetworkRequestErrorMixin.vue";
import Errors from "@/../../knightlands-shared/errors";
import PurchaseArmySlots from "./PurchaseArmySlots.vue";
import { create } from "vue-modal-dialogs";
import ArmyMeta from "@/metadata/army_meta.json";

const ShowPurchaseArmySlots = create(PurchaseArmySlots);

export default {
  mixins: [PromptMixin, NetworkRequestErrorMixin],
  methods: {
    async handleSummon(request, count) {
      try {
        return await this.performRequestNoCatch(request);
      } catch (exc) {
        if (exc.includes(Errors.NotEnoughArmySlots)) {
          let availableSlots = Math.max(
            this.$game.army.maxSlots - this.$game.army.currentSlots,
            0
          );

          if (this.$game.army.maxSlots < ArmyMeta.maxSlots) {
            const response = await this.showPrompt(
              "army-no-slots",
              this.$t("army-p-slots", { count: availableSlots }),
              [
                { type: "green", title: "btn-a-more", response: 2 },
                { type: "red", title: "btn-cancel", response: 1 }
              ]
            );

            if (response == 2) {
              await ShowPurchaseArmySlots();
            }
          } else {
            let requiredSlots = (count || 1) - availableSlots;
            const response = await this.showPrompt(
              "army-no-slots",
              this.$t("army-p-no-slots", {
                count: availableSlots,
                count2: requiredSlots
              }),
              [
                { type: "yellow", title: "dismiss", response: 2 },
                { type: "grey", title: "reserve", response: 3 },
                { type: "red", title: "btn-cancel", response: 1 }
              ]
            );

            if (response == 2) {
              this.$router.push({ name: "units-dismiss" });
            } else if (response == 3) {
              this.$router.push({ name: "units-reserve" });
            }
          }
        }
      }
    }
  }
};
</script>

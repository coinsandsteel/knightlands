<template>
  <div class="width-100 flex flex-column flex-center margin-bottom-1">
    <PurchaseButton
      type="yellow margin-bottom-1"
      v-for="(iap, index) in iaps"
      :key="index"
      :price="iap.price"
      @click="$emit('purchase', trialType, index)"
    >
      <div class="flex flex-center">
        <span class="item-icon" :class="ticketIcon"></span>
        <span class="margin-left-half margin-right-2">x{{ iap.attempts }}</span>
      </div>
    </PurchaseButton>
  </div>
</template>

<script>
import PurchaseButton from "@/components/PurchaseButton.vue";
import TrialType from "@/../../knightlands-shared/trial_type";
import TrialsOfHonorMeta from "@/trials_of_honor";
import TrialsOfDecayMeta from "@/trials_of_decay";
import ConjuredTrialsMeta from "@/conjured_trials";

export default {
  props: ["trialType", "iaps"],
  components: { PurchaseButton },
  computed: {
    ticketIcon() {
      return this.$game.itemsDB.getIcon(this.meta.ticketItem);
    },
    meta() {
      switch (this.trialType) {
        case TrialType.Weapon:
          return ConjuredTrialsMeta;
        case TrialType.Armour:
          return TrialsOfHonorMeta;
        case TrialType.Accessory:
          return TrialsOfDecayMeta;
      }
      return null;
    }
  }
};
</script>

<template>
  <UserDialog title="trials-purchase-attempts" :compact="true" @close="$close">
    <template v-slot:content>
      <div class="flex flex-column flex-space-evenly width-100">
        <AttemptPurchaseElement
          :trialType="trialType"
          :iaps="iaps"
        ></AttemptPurchaseElement>
      </div>
    </template>
  </UserDialog>
</template>

<script>
import UserDialog from "@/components/UserDialog.vue";
import TrialType from "@/../../knightlands-shared/trial_type";
import AttemptPurchaseElement from "./AttemptPurchaseElement.vue";

const iapsByType = {};
iapsByType[TrialType.Armour] = require("@/trials_of_honor").iaps;
iapsByType[TrialType.Weapon] = require("@/conjured_trials").iaps;
iapsByType[TrialType.Accessory] = require("@/trials_of_decay").iaps;

export default {
  props: ["trialType"],
  components: {
    UserDialog,
    AttemptPurchaseElement
  },
  data: () => ({
    trialTypes: TrialType,
    iaps: []
  }),
  mounted() {
    this.iaps = iapsByType[this.trialType];
    console.log(this.iaps);
  }
};
</script>

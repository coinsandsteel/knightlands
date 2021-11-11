<template>
  <UserDialog title="trials-purchase-attempts" :compact="true" @close="$close">
    <template v-slot:content>
      <AttemptPurchaseElement
        v-if="canPurchase"
        :trialType="trialType"
        :iaps="iaps"
        @purchase="purchaseAttempts"
      ></AttemptPurchaseElement>
      <div class="flex flex-center" v-else>
        <span class="text-warn font-size-22 font-weight-900">{{
          $t("att-max")
        }}</span>
      </div>
    </template>
  </UserDialog>
</template>

<script>
import UserDialog from "@/components/UserDialog.vue";
import TrialType from "@/../../knightlands-shared/trial_type";
import AttemptPurchaseElement from "./AttemptPurchaseElement.vue";
import NetworkRequestErrorMixin from "@/components/NetworkRequestErrorMixin.vue";

const iapsByType = {};
iapsByType[TrialType.Armour] = require("@/trials_of_honor").iaps;
iapsByType[TrialType.Weapon] = require("@/conjured_trials").iaps;
iapsByType[TrialType.Accessory] = require("@/trials_of_decay").iaps;

export default {
  mixins: [NetworkRequestErrorMixin],
  props: ["trialType", "canPurchase"],
  components: {
    UserDialog,
    AttemptPurchaseElement
  },
  computed: {
    iaps() {
      return iapsByType[this.trialType];
    }
  },
  methods: {
    async purchaseAttempts(trialType, index) {
      await this.performRequest(
        this.$game.purchaseTrialsAttempts(trialType, index)
      );
      this.$close();
    }
  }
};
</script>

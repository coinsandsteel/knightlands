<template>
  <div class="width-100 flex flex-center margin-bottom-1">
    <PaymentStatus :request="refillStatusRequest" @pay="continuePurchase">
        <div class="flex flex-column">
          <PromisedButton
          type="yellow margin-bottom-1"
          v-for="(iap, index) in iaps"
          :key="index"
          @click="purchaseAttempts(index)"
        >
          <div class="flex">
            <span class="item-icon" :class="trialType"></span>
            <span class="margin-left-half margin-right-1">x{{iap.attempts}}</span>
            <PriceTag :iap="iap.iap" :dark="true"></PriceTag>
          </div>
        </PromisedButton>
        </div>
    </PaymentStatus>
  </div>
</template>

<script>
import PaymentHandler from "@/components/PaymentHandler.vue";
import PaymentStatus from "@/components/PaymentStatus.vue";
import PromisedButton from "@/components/PromisedButton.vue";
import PriceTag from "@/components/PriceTag.vue";
import Events from "@/../knightlands-shared/events";

export default {
  mixins: [PaymentHandler],
  props: ["trialType", "iaps"],
  components: { PaymentStatus, PromisedButton, PriceTag },
  data: () => ({
    refillStatusRequest: null,
    paymentRequest: null
  }),
  created() {
    this.$options.paymentEvents = [Events.TrialAttemptsPurchased];
    this.fetchPaymentStatus();
  },
  methods: {
    async fetchPaymentStatus(iap) {
      this.refillStatusRequest = this.$game.fetchTrialsAttemptsStatus(
        this.trialType
      );
      await this.refillStatusRequest;
    },
    async purchaseAttempts(index) {
      this.paymentRequest = this.$game.purchaseTrialsAttempts(
        this.trialType,
        index
      );
      await this.purchaseRequest(this.paymentRequest);
    }
  }
};
</script>
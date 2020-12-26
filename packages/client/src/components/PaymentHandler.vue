<script>
import PromptMixin from "@/components/PromptMixin.vue";
import Events from "@/../../knightlands-shared/events";

export default {
  mixins: [PromptMixin],
  data: () => ({
    _internalIap: null
  }),
  paymentEvents: [Events.PurchaseComplete],
  mounted() {
    this.listener = this._handlePaymentComplete.bind(this);
    this.$options.paymentEvents.forEach(evt => {
      this.$game.on(evt, this.listener);
    });
  },
  destroyed() {
    this.$options.paymentEvents.forEach(evt => {
      this.$game.off(evt, this.listener);
    });
  },
  methods: {
    setIap(iap) {
      this._internalIap = iap;
    },
    async _handlePaymentComplete(data) {
      console.log("handlePaymentComplete", data, this._internalIap);
      if (data.iap != this._internalIap) {
        return;
      }

      if (data.reason) {
        console.log("Payment failed with exception", data);
        this.showPrompt(
          this.$t("prompt-snap-title"),
          this.$t("payment-failed"),
          [
            {
              type: "red",
              title: "btn-ok",
              response: true
            }
          ]
        );

        this.handlePaymentFailed(data.iap, data.context, data.reason);
      } else {
        this.handlePaymentComplete(data.iap, data.context);
      }

      await this.fetchPaymentStatus(data.iap);
    },
    handlePaymentComplete(iap, context) {},
    handlePaymentFailed(iap, context) {},
    async purchaseRequest(purchaseRequest) {
      let response = await purchaseRequest;
      let { signature, price, iap, paymentId, nonce, timestamp } = response;
      if (signature && price && iap && paymentId) {
        await this.purchase(signature, price, iap, paymentId, nonce, timestamp);
      } else {
        return response;
      }
    },
    async purchase(signature, price, iap, paymentId, nonce, timestamp) {
      try {
        console.log("purchase....");
        await this.$game.purchaseIAP(
          iap,
          paymentId,
          price,
          nonce,
          timestamp,
          signature
        );
        await this.fetchPaymentStatus(iap);
      } catch (exc) {
        console.log("Payment failed with exception", exc);
        this.showPrompt(
          this.$t("prompt-snap-title"),
          this.$t("payment-failed"),
          [
            {
              type: "red",
              title: "btn-ok",
              response: true
            }
          ]
        );
      }
    },
    async continuePurchase(paymentStatus) {
      let {
        signature,
        price,
        iap,
        paymentId,
        nonce,
        timestamp
      } = paymentStatus;
      await this.purchase(signature, price, iap, paymentId, nonce, timestamp);
    },
    async cancelPurchase(paymentStatus) {
      await this.$game.cancelPurchase(paymentStatus.id);
      await this.fetchPaymentStatus(paymentStatus.iap);
    }
  }
};
</script>

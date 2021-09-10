<script>
import PromptMixin from "@/components/PromptMixin.vue";
import Events from "@/../../knightlands-shared/events";
import ConnectWallet from "@/views/Account/ConnectWallet.vue";
import { create } from "vue-modal-dialogs";

const ShowWallet = create(ConnectWallet, "chain");

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
      console.log(iap);
      this._internalIap = iap;
    },
    async _handlePaymentComplete(data) {
      if (data.reason) {
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
    fetchPaymentStatus(iap) {},
    handlePaymentComplete(iap, context) {},
    handlePaymentFailed(iap, context) {},
    async purchaseRequest(purchaseRequest) {
      let response = await purchaseRequest;
      let { signature, price, iap, paymentId, nonce, deadline } = response;
      if (signature && price && iap && paymentId) {
        await this.purchase(signature, price, iap, paymentId, nonce, deadline);
      } else {
        return response;
      }
    },
    async beforePurchase() {},
    async purchase(signature, price, iap, paymentId, nonce, deadline) {
      try {
        await this.$game.purchaseIAP(
          iap,
          paymentId,
          price,
          nonce,
          deadline,
          signature
        );
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
      } finally {
        await this.fetchPaymentStatus(iap);
      }
    },
    async continuePurchase(paymentStatus) {
      let {
        signature,
        price,
        iap,
        paymentId,
        nonce,
        deadline,
        chain
      } = paymentStatus;
      const result = await ShowWallet(chain);
      if (result) {
        await this.purchase(signature, price, iap, paymentId, nonce, deadline);
      }
    },
    async cancelPurchase(paymentStatus) {
      await this.$game.cancelPurchase(paymentStatus.id);
      await this.fetchPaymentStatus(paymentStatus.iap);
    }
  }
};
</script>

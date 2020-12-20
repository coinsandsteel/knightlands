<script>
import PaymentHandler from "@/components/PaymentHandler.vue";

export default {
  mixins: [PaymentHandler],
  data: () => ({
    request: null
  }),
  methods: {
    async fetchPaymentStatus(iap) {
      return this.$game.paymentStatus(iap);
    },
    async purchase(iap) {
      await this.purchaseRequest(this.$game.purchase(iap, this.$game.account));
    }
  }
};
</script>

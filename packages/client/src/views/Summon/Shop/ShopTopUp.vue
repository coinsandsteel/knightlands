<template>
  <PaymentStatus
    :request="request"
    :cancel="true"
    @iap="setIap"
    @pay="continuePurchase"
    class="width-100"
  >
    <div class="shop-container">
      <ShiniesShopElement
        v-for="entry in shinies"
        :key="entry.iap"
        :data="entry"
        @purchase="handlePurchase"
      />
    </div>
  </PaymentStatus>
</template>

<script>
import ShiniesShopElement from "./ShiniesShopElement.vue";
import Meta from "@/top_up_shop";
import NetworkRequestErrorMixin from "@/components/NetworkRequestErrorMixin.vue";
import PaymentHandler from "@/components/PaymentHandler.vue";
import PaymentStatus from "@/components/PaymentStatus.vue";
import Events from "@/../../knightlands-shared/events";

export default {
  mixins: [NetworkRequestErrorMixin, PaymentHandler],
  components: { ShiniesShopElement, PaymentStatus },
  data: () => ({
    shinies: Meta.shinies,
    request: null
  }),
  created() {
    this.$options.paymentEvents = [Events.PurchaseComplete];
  },
  activated() {
    this.fetchPaymentStatus();
  },
  methods: {
    async fetchPaymentStatus() {
      this.request = this.$game.paymentStatus();
    },
    async handlePurchase(iap) {
      this.setIap(iap);
      await this.purchaseRequest(this.$game.purchase(iap, this.$game.account));
    }
  }
};
</script>

<style lang="less" scoped>
.shop-container {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(30%, 1fr));
  justify-items: center;
}
</style>

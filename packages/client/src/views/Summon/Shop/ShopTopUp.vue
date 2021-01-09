<template>
  <PaymentStatus
    :request="request"
    :cancel="true"
    @iap="setIap"
    @pay="continuePurchase"
    @cancel="cancelPurchase"
    class="width-100"
  >
    <div class="shop-container">
      <TopUpShopElement
        v-for="entry in shinies"
        :key="entry.iap"
        :data="entry"
        @purchase="handlePurchase"
      />
    </div>

    <div class="shop-container margin-top-2">
      <TopUpShopElement
        v-for="entry in tickets"
        :key="entry.iap"
        :data="entry"
        @purchase="handlePurchase"
      />
    </div>
  </PaymentStatus>
</template>

<script>
import TopUpShopElement from "./TopUpShopElement.vue";
import Meta from "@/top_up_shop";
import NetworkRequestErrorMixin from "@/components/NetworkRequestErrorMixin.vue";
import PaymentHandler from "@/components/PaymentHandler.vue";
import PaymentStatus from "@/components/PaymentStatus.vue";
import ConnectWallet from "@/views/Account/ConnectWallet.vue";

import ItemsReceived from "@/components/ItemsReceived.vue";
import { create } from "vue-modal-dialogs";

const ShowDialog = create(ItemsReceived, "items", "soft", "hard");
const ShowWallet = create(ConnectWallet);

export default {
  mixins: [NetworkRequestErrorMixin, PaymentHandler],
  components: { TopUpShopElement, PaymentStatus },
  data: () => ({
    shinies: Meta.shinies,
    tickets: Meta.raidTickets,
    request: null
  }),
  activated() {
    this.fetchPaymentStatus();
  },
  methods: {
    handlePaymentComplete(iap, context) {
      if (context.item) {
        ShowDialog([context]);
      } else {
        ShowDialog([], 0, context.hard);
      }
    },
    async fetchPaymentStatus() {
      this.request = this.$game.paymentStatus();
    },
    async beforePurchase() {
      await ShowWallet();
    },
    async handlePurchase(iap) {
      this.setIap(iap);
      await this.beforePurchase();
      await this.purchaseRequest(this.$game.purchase(iap));
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

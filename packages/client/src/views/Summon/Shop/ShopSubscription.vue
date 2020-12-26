<template>
  <PaymentStatus
    :request="request"
    :cancel="true"
    @iap="setIap"
    @pay="continuePurchase"
  >
    <div class="height-100" v-bar>
      <div class="flex flex-column width-100 padding-top-2">
        <CardShopElement
          v-for="(card, idx) in cards"
          :key="idx"
          :card="card"
          @purchase="handlePurchase(card)"
        />
      </div>
    </div>
  </PaymentStatus>
</template>

<script>
import Meta from "@/subscriptions";
import NetworkRequestErrorMixin from "@/components/NetworkRequestErrorMixin.vue";
import PaymentHandler from "@/components/PaymentHandler.vue";
import PaymentStatus from "@/components/PaymentStatus.vue";
import Events from "@/../../knightlands-shared/events";
import CardShopElement from "./CardShopElement.vue";

import ItemsReceived from "@/components/ItemsReceived.vue";
import { create } from "vue-modal-dialogs";

const ShowDialog = create(ItemsReceived, "items", "soft", "hard");

export default {
  mixins: [NetworkRequestErrorMixin, PaymentHandler],
  components: { CardShopElement, PaymentStatus },
  data: () => ({
    request: null
  }),
  created() {
    this.$options.paymentEvents = [Events.PurchaseComplete];
  },
  activated() {
    this.fetchPaymentStatus();
  },
  computed: {
    cards() {
      return Meta.cards;
    }
  },
  methods: {
    async fetchPaymentStatus() {
      this.request = this.$game.paymentStatus();
    },
    async handlePurchase(card) {
      const request = this.$game.purchaseCard(card.id, this.$game.address);
      this.setIap(card.iap);
      await this.purchaseRequest(request);
    },
    handlePaymentComplete(iap, context) {
      if (context.soft > 0 || context.hard > 0) {
        ShowDialog([], context.soft, context.hard);
      }
    }
  }
};
</script>

<template>
  <PaymentStatus
    :request="request"
    :cancel="true"
    @iap="setIap"
    @pay="continuePurchase"
    class="width-100"
  >
    <div class="fle flex-column widht-100">
      <PremiumPackElement
        v-for="(pack, idx) in packs"
        :key="idx"
        :pack="pack"
        @purchase="handlePurchase(pack)"
      />
    </div>
  </PaymentStatus>
</template>

<script>
import Meta from "@/premium_shop";
import PremiumPackElement from "./PremiumPackElement.vue";
import NetworkRequestErrorMixin from "@/components/NetworkRequestErrorMixin.vue";
import PaymentHandler from "@/components/PaymentHandler.vue";
import PaymentStatus from "@/components/PaymentStatus.vue";
import Events from "@/../../knightlands-shared/events";

import ItemsReceived from "@/components/ItemsReceived.vue";
import { create } from "vue-modal-dialogs";

const ShowDialog = create(ItemsReceived, "items");

export default {
  mixins: [NetworkRequestErrorMixin, PaymentHandler],
  components: { PremiumPackElement, PaymentStatus },
  created() {
    this.$options.paymentEvents = [Events.PurchaseComplete];
  },
  data: () => ({
    request: null
  }),
  activated() {
    this.fetchPaymentStatus();
  },
  computed: {
    packs() {
      return Meta.packs;
    }
  },
  methods: {
    async fetchPaymentStatus() {
      this.request = this.$game.paymentStatus();
    },
    async handlePurchase(pack) {
      const request = this.$game.purchasePack(pack.id, this.$game.account);

      if (pack.iap) {
        this.setIap(pack.iap);
        await this.purchaseRequest(request);
      } else {
        const items = await request;
        this.handlePaymentComplete("", items);
      }
    },
    handlePaymentComplete(iap, items) {
      ShowDialog(items);
    }
  }
};
</script>

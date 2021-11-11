<template>
  <PaymentStatus :cancel="true" v-on="$listeners">
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
import PaymentHandler from "@/components/PaymentHandler.vue";
import PaymentStatus from "@/components/PaymentStatus.vue";
import CardShopElement from "./CardShopElement.vue";

import ItemsReceived from "@/components/ItemsReceived.vue";
import { create } from "vue-modal-dialogs";

const ShowDialog = create(ItemsReceived, "items", "soft", "hard");

const FOUNDER_SALE = 3;

export default {
  mixins: [PaymentHandler],
  components: { CardShopElement, PaymentStatus },
  computed: {
    cards() {
      let cards = Meta.cards;
      if (!this.$game.subscription.hasSubscription(FOUNDER_SALE)) {
        cards = cards.filter(x => x.id != FOUNDER_SALE);
      }
      return cards;
    }
  },
  methods: {
    async handlePurchase(card) {
      this.$emit("purchase", ({ chain, address }) => {
        return this.$game.purchaseCard(card.id, address, chain);
      });
    },
    handlePaymentComplete(iap, context) {
      if (context.soft > 0 || context.hard > 0) {
        ShowDialog([], context.soft, context.hard);
      }
    }
  }
};
</script>

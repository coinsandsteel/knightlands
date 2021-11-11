<template>
  <PaymentStatus :cancel="true" v-on="$listeners">
    <div class="height-100 " v-bar>
      <div class="flex flex-column width-100 padding-top-2">
        <PremiumPackElement
          v-for="(pack, idx) in packs"
          :key="idx"
          :idx="idx"
          :pack="pack"
          @purchase="handlePurchase(pack)"
        />
      </div>
    </div>
  </PaymentStatus>
</template>

<script>
import Meta from "@/premium_shop";
import PremiumPackElement from "./PremiumPackElement.vue";
import NetworkRequestErrorMixin from "@/components/NetworkRequestErrorMixin.vue";
import PaymentStatus from "@/components/PaymentStatus.vue";
import PaymentHandler from "@/components/PaymentHandler.vue";
import ItemsReceived from "@/components/ItemsReceived.vue";
import { create } from "vue-modal-dialogs";

const ShowDialog = create(ItemsReceived, "items");

export default {
  mixins: [NetworkRequestErrorMixin, PaymentHandler],
  components: { PremiumPackElement, PaymentStatus },
  computed: {
    packs() {
      const packs = Meta.packs;
      return packs
        .filter(pack => {
          if (pack.max) {
            return (
              pack.max - (this.$game.dailyShop.singlePurchases[pack.id] || 0) >
              0
            );
          }

          return true;
        })
        .sort((x, y) => x.order - y.order);
    }
  },
  methods: {
    handlePaymentComplete(iap, context) {
      ShowDialog(context);
    },
    async handlePurchase(pack) {
      if (pack.iap) {
        this.$emit("purchase", ({ chain, address }) => {
          return this.$game.purchasePack(pack.id, address, chain);
        });
      } else {
        const items = await this.$game.purchasePack(pack.id);
        ShowDialog(items);
      }
    }
  }
};
</script>

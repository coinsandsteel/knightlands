<template>
  <PaymentStatus :cancel="true" v-on="$listeners">
    <div class="height-100 " v-bar>
      <div class="flex flex-column width-100 padding-top-2">
        <PremiumPackElement
          v-for="(pack, idx) in packs"
          :key="idx"
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

import ItemsReceived from "@/components/ItemsReceived.vue";
import { create } from "vue-modal-dialogs";

const ShowDialog = create(ItemsReceived, "items");

export default {
  mixins: [NetworkRequestErrorMixin],
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
    async handlePurchase(pack) {
      if (pack.iap) {
        this.$emit("purchase", () => {
          return this.$game.purchasePack(pack.id, this.$game.address);
        });
      } else {
        const items = await this.$game.purchasePack(
          pack.id,
          this.$game.address
        );
        ShowDialog(items);
      }
    }
  }
};
</script>

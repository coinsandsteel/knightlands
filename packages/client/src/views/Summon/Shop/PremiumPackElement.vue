<template>
  <div class="flex flex-column flex-center margin-1 padding-1">
    <div class="flex flex-center">
      <Loot
        v-for="item in items"
        :key="item.itemId"
        :item="item.itemId"
        :quantity="item.minCount"
        @hint="handleHint"
      />
    </div>

    <span
      class="font-size-20 font-weight-900 font-outline margin-top-1 margin-bottom-1"
      >{{
        pack.max
          ? $t("d-pur-lim", { left: purchasesLeft })
          : $t("d-pur-left", { left: purchasesLeft })
      }}</span
    >

    <PurchaseButton
      type="grey"
      :price="pack.price"
      :disabled="purchasesLeft == 0"
      @click="$emit('purchase')"
      v-if="pack.price > 0"
    >
    </PurchaseButton>
    <CustomButton
      v-else
      type="grey"
      :disabled="purchasesLeft == 0"
      @click="$emit('purchase')"
    >
      <PriceTag :iap="pack.iap" :dark="true" />
    </CustomButton>
  </div>
</template>

<script>
import CustomButton from "@/components/Button.vue";
import Loot from "@/components/Loot.vue";
import PurchaseButton from "@/components/PurchaseButton.vue";
import HintHandler from "@/components/HintHandler.vue";
import PriceTag from "@/components/PriceTag.vue";

export default {
  mixins: [HintHandler],
  components: { CustomButton, PurchaseButton, Loot, PriceTag },
  props: ["pack"],
  data: () => ({
    request: null
  }),

  computed: {
    purchasesLeft() {
      if (this.pack.max) {
        return (
          this.pack.max -
          (this.$game.dailyShop.singlePurchases[this.pack.id] || 0)
        );
      }

      if (this.pack.dailyMax) {
        return (
          this.pack.dailyMax -
          (this.$game.dailyShop.dailyPurchases[this.pack.id] || 0)
        );
      }

      return (
        this.pack.weeklyMax -
        (this.$game.dailyShop.weeklyPurchases[this.pack.id] || 0)
      );
    },
    items() {
      return this.pack.loot.guaranteedLootRecords;
    }
  }
};
</script>

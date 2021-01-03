<template>
  <div class="flex flex-column flex-center margin-1 padding-1">
    <Loot :item="data.item" :quantity="data.count" @hint="handleHint" />
    <span class="font-size-18 font-weight-900 font-outline margin-half">{{
      $t("d-pur-left", { left: purchasesLeft })
    }}</span>
    <PurchaseButton
      type="grey"
      :soft="true"
      :price="data.soft"
      :disabled="purchasesLeft == 0"
      @click="$emit('purchase')"
      v-if="data.soft > 0"
    >
    </PurchaseButton>
    <PurchaseButton
      type="grey"
      :price="data.hard"
      :disabled="purchasesLeft == 0"
      @click="$emit('purchase')"
      v-if="data.hard > 0"
    >
    </PurchaseButton>
  </div>
</template>

<script>
import Loot from "@/components/Loot.vue";
import PurchaseButton from "@/components/PurchaseButton.vue";
import HintHandler from "@/components/HintHandler.vue";

export default {
  mixins: [HintHandler],
  components: { Loot, PurchaseButton },
  props: ["data", "index", "fixed"],
  computed: {
    purchasesLeft() {
      const purchaseData = this.fixed
        ? this.$game.dailyShop.fixedItems
        : this.$game.dailyShop.purchasedItems;
      return this.data.max - (purchaseData[this.index] || 0);
    }
  }
};
</script>

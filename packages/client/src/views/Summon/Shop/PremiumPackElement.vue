<template>
  <div class="flex flex-column flex-center padding-top-1 padding-bottom-1">
    <Title :stackTop="true" :stackBottom="true">{{ $t(pack.title) }}</Title>
    <div class="content">
      <img class="banner" :src="`/images/banners/${bg}.jpg`" />

      <div class="items flex flex-column flex-center">
        <div class="flex flex-center margin-top-2">
          <Loot
            v-for="item in items"
            :key="item.itemId"
            :item="item.itemId"
            :quantity="item.minCount"
            @hint="handleHint"
          />
        </div>

        <span
          class="font-size-20 title font-weight-900 font-outline margin-top-1 margin-bottom-1"
          >{{
            pack.max
              ? $t("d-pur-lim", { left: purchasesLeft, max: pack.max })
              : pack.dailyMax
              ? $t("d-pur-daily", { left: purchasesLeft, max: pack.dailyMax })
              : $t("d-pur-weekly", { left: purchasesLeft, max: pack.weeklyMax })
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
    </div>
  </div>
</template>

<script>
import CustomButton from "@/components/Button.vue";
import Loot from "@/components/Loot.vue";
import Title from "@/components/Title.vue";
import PurchaseButton from "@/components/PurchaseButton.vue";
import HintHandler from "@/components/HintHandler.vue";
import PriceTag from "@/components/PriceTag.vue";

export default {
  mixins: [HintHandler],
  components: { CustomButton, PurchaseButton, Loot, PriceTag, Title },
  props: ["pack"],
  data: () => ({
    request: null
  }),
  computed: {
    bg() {
      return this.pack.banner;
    },
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

<style lang="less" scoped>
.content {
  display: grid;
  grid-template-columns: 50% 40% 10%;
  grid-template-rows: 1fr;
  align-items: stretch;

  & .banner {
    grid-row: 1;
    grid-column: ~"1/4";
    max-width: 100%;
  }

  & .items {
    grid-row: 1;
    grid-column: 2;
    width: 100%;
    height: 100%;
  }
}
</style>

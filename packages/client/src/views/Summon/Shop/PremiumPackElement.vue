<template>
  <div class="flex flex-column flex-items-center relative prem-p">
    <Title :stackTop="true" :stackBottom="true">{{ $t(pack.title) }}</Title>
    <div class="banner absolute-stretch" :class="`b${idx}`"></div>
    <div class="content width-100 relative full-flex">
      <div class="icon" :style="icon" />
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
  props: ["pack", "idx"],
  computed: {
    icon() {
      return {
        "background-image": `url(${`/images/banners/${this.pack.banner}.png`})`
      };
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
.banner {
  background-image: url("../../../assets/shop/shop_packs_pattern1.jpg");
  background-repeat: repeat-x;
  background-size: contain;

  &.b1 {
    background-image: url("../../../assets/shop/shop_packs_pattern2.jpg");
  }

  &.b2 {
    background-image: url("../../../assets/shop/shop_packs_pattern3.jpg");
  }

  &.b3 {
    background-image: url("../../../assets/shop/shop_packs_pattern4.jpg");
  }

  &.b4 {
    background-image: url("../../../assets/shop/shop_packs_pattern5.jpg");
  }
}

.prem-p {
  height: 40rem;
}

.content {
  display: grid;
  grid-template-columns: 50% 40% 10%;
  grid-template-rows: 1fr;
  align-items: stretch;
  padding-top: 2rem;
  padding-bottom: 2rem;

  & .icon {
    grid-row: 1;
    grid-column: 1;
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center;
  }

  & .items {
    grid-row: 1;
    grid-column: 2;
    width: 100%;
    height: 100%;
  }
}
</style>

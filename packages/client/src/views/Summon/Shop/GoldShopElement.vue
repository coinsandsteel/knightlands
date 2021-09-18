<template>
  <div class="flex flex-column flex-center margin-1 gold-pack">
    <img :src="`/images/banners/gold${index}.png`" />
    <div class="padding-1 price-l">
      <IconWithValue iconClass="icon-gold">{{ data.amount }}</IconWithValue>
    </div>
    <PurchaseButton
      type="grey"
      class="margin-top-1 margin-bottom-1"
      @click="$emit('purchase')"
      minWidth="15rem"
      :price="data.price"
    />
  </div>
</template>

<script>
import PurchaseButton from "@/components/PurchaseButton.vue";
import HintHandler from "@/components/HintHandler.vue";
import IconWithValue from "@/components/IconWithValue.vue";

export default {
  mixins: [HintHandler],
  components: { PurchaseButton, IconWithValue },
  props: ["data", "index"]
};
</script>

<style lang="less" scoped>
.gold-pack {
  border-image: url("../../../assets/ui/shop_packs_bg.svg");
  border-image-slice: 19 fill;
  border-image-width: 18px;
  border-image-repeat: stretch stretch;

  & img {
    max-width: 100%;
  }

  & .price-l {
    width: calc(100% - 6px);
    background-color: #172b44;
  }
}
</style>

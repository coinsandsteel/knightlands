<template>
  <div class="flex flex-column flex-center gold-pack">
    <img :src="`/images/banners/ticket${index + 1}.png`" />
    <div class="padding-1 price-l">
      <IconWithValue>{{ data.tickets }}</IconWithValue>
    </div>
    <CustomButton
      class="margin-top-1 margin-bottom-1"
      type="grey"
      minWidth="15rem"
      @click="$emit('purchase', data.iap)"
    >
      <PriceTag :iap="data.iap" :dark="true" />
    </CustomButton>
  </div>
</template>

<script>
import PriceTag from "@/components/PriceTag.vue";
import CustomButton from "@/components/Button.vue";
import HintHandler from "@/components/HintHandler.vue";
import IconWithValue from "@/components/IconWithValue.vue";

export default {
  mixins: [HintHandler],
  components: { CustomButton, IconWithValue, PriceTag },
  props: ["data", "index"]
};
</script>

<style lang="less" scoped>
.gold-pack {
  border-image: url("../../../assets/ui/shop_packs_bg.svg");
  border-image-slice: 19 fill;
  border-image-width: 18px;
  border-image-repeat: stretch stretch;
  margin: 0.5rem;

  & img {
    max-width: 100%;
  }

  & .price-l {
    width: calc(100% - 6px);
    background-color: #172b44;
  }
}
</style>

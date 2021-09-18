<template>
  <div class="flex flex-column flex-center margin-1 padding-1 gold-pack">
    <img :src="`/images/banners/gold${index}.png`" />
    <IconWithValue iconClass="icon-gold">{{ data.amount }}</IconWithValue>
    <PurchaseButton
      type="grey"
      class="margin-top-1"
      @click="$emit('purchase')"
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
  border-image-width: 12px;
  border-image-repeat: stretch stretch;

  & img {
    max-width: 100%;
  }
}
</style>

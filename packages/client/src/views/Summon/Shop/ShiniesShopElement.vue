<template>
  <div class="flex flex-column flex-center margin-1 padding-1">
    <PaymentStatus :request="request" @iap="setIap" :cancel="true">
      <CustomButton type="grey" @click="purchase(data.iap)">
        <PriceTag :iap="data.iap" :dark="true" />
      </CustomButton>
    </PaymentStatus>
  </div>
</template>

<script>
import Loot from "@/components/Loot.vue";
import PriceTag from "@/components/PriceTag.vue";
import CustomButton from "@/components/Button.vue";
import HintHandler from "@/components/HintHandler.vue";
import PaymentStatus from "@/components/PaymentStatus.vue";
import ShopPayment from "./ShopPayment.vue";

export default {
  mixins: [HintHandler, ShopPayment],
  components: { Loot, CustomButton, PriceTag, PaymentStatus },
  props: ["data"]
};
</script>

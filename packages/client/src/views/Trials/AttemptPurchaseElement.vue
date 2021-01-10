<template>
  <div class="width-100 flex flex-column flex-center margin-bottom-1">
    <PurchaseButton
      type="yellow margin-bottom-1"
      v-for="(iap, index) in iaps"
      :key="index"
      :price="iap.price"
      @click="$emit('purchase', trialType, index)"
    >
      <div class="flex flex-center">
        <span class="item-icon" :class="trialType"></span>
        <span class="margin-left-half margin-right-2">x{{ iap.attempts }}</span>
      </div>
    </PurchaseButton>
  </div>
</template>

<script>
import PurchaseButton from "@/components/PurchaseButton.vue";

export default {
  props: ["trialType", "iaps"],
  components: { PurchaseButton }
};
</script>

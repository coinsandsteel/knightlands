<template>
  <div class="flex flex-column flex-center margin-1 padding-1">
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
  props: ["data"]
};
</script>

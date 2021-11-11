<template>
  <div class="color-panel-2">
    <PurchaseButton
      type="green"
      @click="$emit('expand')"
      :price="price"
      :soft="true"
    >
      {{ $t("btn-buy-mine") }}
    </PurchaseButton>
  </div>
</template>

<script>
import PurchaseButton from "@/components/PurchaseButton.vue";

export default {
  props: ["price"],
  components: { PurchaseButton }
};
</script>

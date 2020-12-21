<template>
  <div class="flex flex-column flex-center margin-1 padding-1">
    <CustomButton type="grey" @click="$emit('purchase', data.iap)">
      <PriceTag :iap="data.iap" :dark="true" />
    </CustomButton>
  </div>
</template>

<script>
import Loot from "@/components/Loot.vue";
import PriceTag from "@/components/PriceTag.vue";
import CustomButton from "@/components/Button.vue";
import HintHandler from "@/components/HintHandler.vue";

export default {
  mixins: [HintHandler],
  components: { Loot, CustomButton, PriceTag },
  props: ["data"]
};
</script>

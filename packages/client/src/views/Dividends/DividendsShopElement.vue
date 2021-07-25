<template>
  <div class="flex flex-column flex-center margin-1 padding-1 width-100">
    <Loot :item="item" :quantity="quantity" @hint="handleHint" />
    <CustomButton
      type="grey"
      minWidth="8rem"
      @click="$emit('purchase', item, price)"
      :disabled="locked"
    >
      <IconWithValue iconClass="icon-dkt2">{{ price }}</IconWithValue>
    </CustomButton>
  </div>
</template>

<script>
import Loot from "@/components/Loot.vue";
import IconWithValue from "@/components/IconWithValue.vue";
import CustomButton from "@/components/Button.vue";
import HintHandler from "@/components/HintHandler.vue";

export default {
  mixins: [HintHandler],
  components: { Loot, IconWithValue, CustomButton },
  props: ["item", "quantity", "price", "locked"]
};
</script>

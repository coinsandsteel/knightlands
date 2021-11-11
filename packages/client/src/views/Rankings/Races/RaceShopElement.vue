<template>
  <div class="flex flex-column flex-center margin-1 padding-1">
    <Loot :item="item" :quantity="quantity" @hint="handleHint" />
    <span class="padding-1 font-size-18">
      {{ $t("d-pur-daily", { left, max }) }}
    </span>
    <CustomButton
      type="grey"
      @click="$emit('purchase', item, price)"
      :disabled="locked"
    >
      <IconWithValue iconClass="icon-race-token">{{ price }}</IconWithValue>
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
  props: ["item", "quantity", "price", "locked", "max", "count"],
  computed: {
    left() {
      return this.max - this.count;
    }
  }
};
</script>

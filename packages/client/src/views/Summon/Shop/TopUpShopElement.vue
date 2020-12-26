<template>
  <div class="flex flex-column flex-center margin-1 padding-1">
    <Loot
      v-if="data.tickets"
      :item="ticketItem"
      :quantity="data.tickets"
      @hint="handleHint"
    />
    <CustomButton type="grey" @click="$emit('purchase', data.iap)">
      <PriceTag :iap="data.iap" :dark="true" />
    </CustomButton>
  </div>
</template>

<script>
import PriceTag from "@/components/PriceTag.vue";
import CustomButton from "@/components/Button.vue";
import HintHandler from "@/components/HintHandler.vue";
import Loot from "@/components/Loot.vue";
import Meta from "@/top_up_shop";

export default {
  mixins: [HintHandler],
  components: { CustomButton, PriceTag, Loot },
  props: ["data"],
  data: () => ({
    ticketItem: Meta.raidTicket
  })
};
</script>

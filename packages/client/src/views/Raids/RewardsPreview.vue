<template>
  <div class="flex flex-column flex-items-center width-100" v-if="rewards">
    <IconWithValue
      class="margin-bottom-1"
      valueClass="font-size-20 digit-font"
      iconClass="icon-dkt"
      >{{ rewards.dkt }}</IconWithValue
    >

    <IconWithValue
      class="margin-bottom-1"
      valueClass="font-size-20 digit-font"
      iconClass="icon-gold"
      >{{ rewards.gold }}</IconWithValue
    >

    <IconWithValue
      class="margin-bottom-1"
      valueClass="font-size-20 digit-font"
      iconClass="icon-premium"
      >{{ rewards.hardCurrency }}</IconWithValue
    >

    <!-- <IconWithValue valueClass="font-size-20 digit-font" iconClass="icon-exp">{{rewards.exp}}</IconWithValue> -->

    <div class="flex flex-center flex-column margin-top-3">
      <div class="flex flex-center reward-loot">
        <loot
          v-for="item in rewards.items"
          :item="item.item"
          :quantity="item.quantity"
          :key="item.item"
          :gacha="true"
          @hint="handleHint"
        ></loot>
      </div>
    </div>
  </div>
</template>

<script>
import IconWithValue from "@/components/IconWithValue.vue";
import Loot from "@/components/Loot.vue";
import HintHandler from "@/components/HintHandler.vue";

export default {
  props: ["rewards"],
  mixins: [HintHandler],
  components: {
    IconWithValue,
    Loot
  }
};
</script>

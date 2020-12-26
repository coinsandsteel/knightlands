<template>
  <div class="width-100 flex flex-column flex-center margin-bottom-1">
    <PromisedButton
      type="yellow margin-bottom-1"
      v-for="(iap, index) in iaps"
      :key="index"
      @click="$emit('purchase', trialType, index)"
    >
      <div class="flex flex-center">
        <span class="item-icon" :class="trialType"></span>
        <span class="margin-left-half margin-right-2">x{{ iap.attempts }}</span>

        <IconWithValue iconClass="icon-premium">{{ iap.price }}</IconWithValue>
      </div>
    </PromisedButton>
  </div>
</template>

<script>
import PromisedButton from "@/components/PromisedButton.vue";
import IconWithValue from "@/components/IconWithValue.vue";

export default {
  props: ["trialType", "iaps"],
  components: { PromisedButton, IconWithValue }
};
</script>

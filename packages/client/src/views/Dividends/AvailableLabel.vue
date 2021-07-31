<template>
  <div class="flex flex-center margin-left-2" @click="$emit('max')">
    <span
      class="flex-2 font-size-18 grey-title font-weight-900 margin-right-1"
      >{{ $t(title) }}</span
    >
    <IconWithValue
      :iconClass="`icon-${currencyType}`"
      valueClass="grey-title font-size-18"
      :flip="true"
      >{{ balance }}</IconWithValue
    >
  </div>
</template>

<script>
import IconWithValue from "@/components/IconWithValue.vue";

export default {
  props: ["currencyType", "title", "balance"],
  components: { IconWithValue }
};
</script>

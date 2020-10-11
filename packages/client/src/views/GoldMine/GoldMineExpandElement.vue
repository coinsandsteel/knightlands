<template>
  <div class="color-panel-2">
    <CustomButton type="green" @click="$emit('expand')">
      {{ $t("btn-buy-mine") }}
      <IconWithValue iconClass="icon-gold">{{ price }}</IconWithValue>
    </CustomButton>
  </div>
</template>

<script>
import CustomButton from "@/components/Button.vue";
import IconWithValue from "@/components/IconWithValue.vue";

export default {
  props: ["price"],
  components: { CustomButton, IconWithValue }
};
</script>

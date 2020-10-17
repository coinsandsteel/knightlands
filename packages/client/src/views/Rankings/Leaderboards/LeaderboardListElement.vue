<template>
  <div
    class="flex flex-space-between flex-center color-panel-1 margin-top-1 margin-bottom-1 padding-left-1 padding-right-1"
  >
    <span class="font-size-20 title">{{ $t(`l-type-${type}`) }}</span>
    <CustomButton type="grey" @click="$emit('view', type)">{{
      $t("btn-preview")
    }}</CustomButton>
  </div>
</template>

<script>
import CustomButton from "@/components/Button.vue";

export default {
  props: ["type"],
  components: { CustomButton }
};
</script>

<template>
  <div class="flex flex-items-end">
    <CustomButton
      type="red"
      class="inline-block margin-right-2 margin-top-1"
      @click="$emit('level-updated', 'expert')"
    >
      {{ $t("btn-expert") }}
    </CustomButton>
    <CustomButton
      type="yellow"
      class="inline-block margin-right-1"
      @click="$emit('level-updated', 'advanced')"
    >
      {{ $t("btn-advanced") }}
    </CustomButton>
    <CustomButton
      type="grey"
      class="inline-block margin-right-2 margin-top-1"
      @click="$emit('level-updated', 'basic')"
    >
      {{ $t("btn-basic") }}
    </CustomButton>
  </div>
</template>

<script>
import CustomButton from "@/components/Button.vue";

export default {
  components: {
    CustomButton
  }
};
</script>

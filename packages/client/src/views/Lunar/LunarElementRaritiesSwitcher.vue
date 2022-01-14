<template>
  <div class="flex flex-items-end">
    <CustomButton
      v-if="isExpertRarityVisible"
      type="red"
      class="inline-block margin-right-2 margin-top-1"
      @click="$emit('rarity-updated', 'expert')"
    >
      {{ $t("btn-expert") }}
    </CustomButton>
    <CustomButton
      type="yellow"
      class="inline-block margin-right-1"
      @click="$emit('rarity-updated', 'advanced')"
    >
      {{ $t("btn-advanced") }}
    </CustomButton>
    <CustomButton
      type="grey"
      class="inline-block margin-right-2 margin-top-1"
      @click="$emit('rarity-updated', 'basic')"
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
  },
  props: {
    isExpertRarityVisible: { type: Boolean, default: false }
  }
};
</script>

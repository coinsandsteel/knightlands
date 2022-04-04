<template>
  <div class="flex flex-items-end">
    <CustomButton
      v-if="isExpertRarityVisible"
      type="red"
      class="inline-block margin-right-2 margin-top-1"
      @click="$emit('rarity-updated', ITEM_RARITY_EXPERT)"
    >
      {{ $t("btn-expert") }}
    </CustomButton>
    <CustomButton
      type="yellow"
      class="inline-block margin-right-1"
      @click="$emit('rarity-updated', ITEM_RARITY_ADVANCED)"
    >
      {{ $t("btn-advanced") }}
    </CustomButton>
    <CustomButton
      type="grey"
      class="inline-block margin-right-2 margin-top-1"
      @click="$emit('rarity-updated', ITEM_RARITY_BASIC)"
    >
      {{ $t("btn-basic") }}
    </CustomButton>
  </div>
</template>

<script>
import {
  ITEM_RARITY_BASIC,
  ITEM_RARITY_ADVANCED,
  ITEM_RARITY_EXPERT
} from "@/../../knightlands-shared/lunar";
import CustomButton from "@/components/Button.vue";

export default {
  components: {
    CustomButton
  },
  props: {
    isExpertRarityVisible: { type: Boolean, default: false }
  },
  data() {
    return {
      ITEM_RARITY_BASIC,
      ITEM_RARITY_ADVANCED,
      ITEM_RARITY_EXPERT
    };
  }
};
</script>

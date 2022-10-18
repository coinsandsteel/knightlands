<template>
  <span class="battle-characteristic-value-wrapper">
    <span
      v-if="isDifferent"
      :class="value > baseValue ? 'rarity-rare' : 'rarity-mythical'"
      >{{ value }}</span
    >
    <span v-if="isDifferent"> / </span> <span>{{ baseValue }}</span></span
  >
</template>
<script>
export default {
  props: {
    value: Number,
    baseValue: Number
  },
  computed: {
    isDifferent() {
      return this.value !== this.baseValue;
    }
  }
};
</script>

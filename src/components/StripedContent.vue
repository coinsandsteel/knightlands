<template>
  <div :class="classes" class="flex flex-items-center relative">
    <div class="stripe" :style="height"></div>
    <div :class="contentClasses" class="relative">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    stripeHeight: {
      type: [String, Number],
      default: null
    },
    contentClasses: [Array, String],
    classes: [Array, String]
  },
  computed: {
    height() {
      if (!this.stripeHeight) {
        return "";
      }
      return `height: ${this.stripeHeight}`;
    }
  }
};
</script>
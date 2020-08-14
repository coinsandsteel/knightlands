<template>
  <div :class="classes" class="flex flex-items-center relative">
    <div class="stripe" :style="style"></div>
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
    classes: [Array, String],
    color: {
      type: String,
      default: "#303048"
    }
  },
  computed: {
    style() {
      if (!this.stripeHeight) {
        return "";
      }
      return {
        height: this.stripeHeight,
        'background-color': this.color
      };
    }
  }
};
</script>
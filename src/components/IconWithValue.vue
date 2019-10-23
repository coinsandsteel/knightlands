<template>
  <div class="flex flex-center flex-no-wrap">
    <span v-if="!flip" v-bind:class="iconClass" class="value-icon"></span>
    <div :class="valueClass">
      <slot>{{value}}</slot>
    </div>
    <span v-if="flip" v-bind:class="iconClass" class="value-icon"></span>
  </div>
</template>

<script>
export default {
  props: {
    iconClass: String,
    value: [String, Number],
    flip: Boolean,
    valueClass: {
      type: String,
      default: "font-size-20"
    }
  }
};
</script>


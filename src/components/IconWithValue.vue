<template>
  <div class="flex flex-center flex-no-wrap">
    <div v-if="!flip" v-bind:class="iconClass" class="value-icon"></div>
    <div :class="valueClass">
      <slot>{{value}}</slot>
    </div>
    <div v-if="flip" v-bind:class="iconClass" class="value-icon"></div>
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


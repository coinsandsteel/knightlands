<template>
  <div
    class="flex flex-items-center flex-no-wrap"
    :class="{ 'flex-inline': inline }"
    @click="$emit('click')"
  >
    <span
      v-if="!flip"
      class="value-icon"
      :class="[iconClass, { m: iconMargin }]"
    ></span>
    <div :class="valueClass">
      <slot>{{ value }}</slot>
    </div>
    <span
      v-if="flip"
      :class="[iconClass, { m: iconMargin }]"
      class="value-icon"
    ></span>
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
    },
    iconMargin: Boolean,
    inline: {
      type: Boolean,
      default: true
    }
  }
};
</script>

<style lang="less" scoped>
.m {
  margin-left: 0.5rem;
  margin-right: 0.5rem;
}
</style>

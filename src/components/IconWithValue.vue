<template>
  <div class="flex flex-center flex-no-wrap">
    <div v-if="!flip" v-bind:class="iconClass" class="value-icon"></div>
    <div class="font-size-20" :class="valueClass">
      <slot>{{value}}</slot>
    </div>
    <div v-if="flip" v-bind:class="iconClass" class="value-icon"></div>
  </div>
</template>

<script>
export default {
  props: ["iconClass", "valueClass", "value", "flip"]
};
</script>


<style lang="less" scoped>
</style>


<template>
  <div class="flex flex-center">
    <div v-bind:class="iconClass" class="value-icon"></div>
    <div class="font-size-18" :class="valueClass">
      <slot>{{value}}</slot>
    </div>
  </div>
</template>

<script>
export default {
  props: ["iconClass", "valueClass", "value"]
};
</script>


<style lang="less" scoped>
</style>


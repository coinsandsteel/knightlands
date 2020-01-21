<template>
  <router-link v-bind="$attrs" tag="div" class="flex-basis-30">
    <div class="flex flex-column flex-center pointer relative">
      <span :class="icon" class="icon-menu relative">
        <slot name="marker"></slot>
      </span>
      <span class="font-size-20 capitalize">
        <slot></slot>
      </span>
    </div>
  </router-link>
</template>

<script>
export default {
  props: ["icon"]
};
</script>

<style lang="less" scoped>
.icon-menu {
  width: 7rem;
  height: 7rem;
}
</style>

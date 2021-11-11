<template>
  <div
    class="width-100 option-item flex flex-items-center padding-1 padding-right-3"
    v-on="$listeners"
  >
    <div class="full-flex font-size-22">
      <slot></slot>
    </div>

    <span class="right-arrow"></span>
  </div>
</template>

<style lang="less" scoped>
.option-item {
  height: 10rem;
}
</style>

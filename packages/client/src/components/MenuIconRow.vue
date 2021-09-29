<template>
  <div
    class="icon-row  width-100 margin-top-2 padding-left-half padding-right-half"
  >
    <slot></slot>
  </div>
</template>

<style lang="less" scoped>
.icon-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  justify-items: center;
}
</style>

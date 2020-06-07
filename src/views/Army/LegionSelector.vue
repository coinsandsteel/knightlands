<template>
  <div class="bg flex flex-center width-100">
    <div class="width-80 flex flex-space-between">
      <span class="nav-arrow left"></span>
      <span class="font-size-20">{{$t("legion-n", {n: 1})}}</span>
      <div class="flex flex-center">
        <span class="margin-right-1 font-size-15">{{$t("damage")}}</span>
        <span class="font-size-20 font-weight-900">999999</span>
      </div>
      <span class="nav-arrow"></span>
    </div>
  </div>
</template>

<style scoped>
.bg {
  background-color: #17395c;
  height: 4rem;
}
</style>

<template>
    <notifications group="loading" position="top" width="100%">
      <template slot="body" slot-scope="props">
        <div class="flex flex-center loading padding-2">
          <div class="bg-color"></div>
          <GridLoader color="#fde648" :size="15" margin="1px" />
          <span class="font-size-30 relative margin-left-2">{{$t("loading")}}</span>
        </div>
      </template>
    </notifications>
</template>

<style lang="less" scoped>
.bg-color {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: #210028;
  opacity: 0.75;
}
</style>

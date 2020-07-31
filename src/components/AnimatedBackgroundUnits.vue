<template>
  <div class="height-100 width-100 relative absolute-stretch">
    <!-- <div class="layer1"></div> -->
    <div class="layer2"></div>
  </div>
</template>

<style lang="less" scoped>
@sizeScale: 100%;
@scrollX: 640px * 1;
@scrollY: 640px * 1;
@duration: 40s;

.layer() {
  background-repeat: repeat;
  background-position: center center;
  position: absolute;
  left: -@scrollX;
  right: -@scrollX;
  bottom: -@scrollY;
  top: -@scrollY;
  // background-size: @sizeScale @sizeScale;
  z-index: -1;
}

.layer1 {
  .layer();
  background-image: url("../assets/ui/bg/mob_ptrn_large.png");
  animation: scroll1 @duration linear infinite;
}

.layer2 {
  .layer();
  background-image: url("../assets/ui/bg/mob_ptrn_small.png");
  animation: scroll2 @duration linear infinite;
}

@keyframes scroll1 {
  0% {
    transform+_: translate3d(0, 0, 0);
  }
  100% {
    transform+_: translate3d(-@scrollX, -@scrollY, 0);
  }
}

@keyframes scroll2 {
  0% {
    transform+_: translate3d(0, 0, 0);
  }
  100% {
    transform+_: translate3d(-@scrollX, -@scrollY, 0);
  }
}
</style>

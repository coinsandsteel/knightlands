<template>
  <div class="height-100 width-100 relative absolute-stretch pointer-events-none">
    <div class="layer1"></div>
    <div class="layer2"></div>
  </div>
</template>

<style lang="less" scoped>
@sizeScale: 40%;
@scrollX: 320px * 0.4;
@scrollY: 320px * 0.4;
@duration: 120s;

.layer() {
  background-repeat: repeat;
  background-position: center center;
  position: absolute;
  left: -@scrollX;
  right: -@scrollX;
  bottom: -@scrollY;
  top: -@scrollY;
  z-index: -1;
  background-size: @sizeScale, @sizeScale;
}

.layer1 {
  .layer();
  background-image: url("../assets/ui/bg/Pattern1.png");
  animation: scroll1 @duration linear infinite;
}

.layer2 {
  .layer();
  background-image: url("../assets/ui/bg/Pattern2.png");
  animation: scroll2 @duration / 2 linear infinite;
}

@keyframes scroll1 {
  0% {
    transform: translate3d(0, 0, 0);
  }
  100% {
    transform: translate3d(-@scrollX, -@scrollY, 0);
  }
}

@keyframes scroll2 {
  0% {
    transform: translate3d(0, 0, 0);
  }
  100% {
    transform: translate3d(-@scrollX, -@scrollY, 0);
  }
}
</style>

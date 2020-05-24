<template>
  <div class="width-100 flex flex-center">
    <div class="flex-full title-side"></div>
    <span class="font-size-22 capitalize title flex flex-center">
        <span>{{title}}</span>
    </span>
    <div class="flex-full title-side"></div>
  </div>
</template>

<script>
export default {
  props: ["title"]
};
</script>

<style lang="less" scoped>
.title {
  border-image-source: url("../assets/ui/title.png");
  border-image-slice: 38 30 38 30 fill;
  border-image-width: 38px 30px 38px 30px;
  border-image-outset: 0px 0px 0px 0px;
  border-image-repeat: round round;
  border-style: solid;
  padding: 0rem 2rem;
  align-self: center;
  height: 32px;
}

.title-side {
  background-image: url("../assets/ui/title1.png");
  height: 14px;
  background-size: 100% 100%;
}
</style>

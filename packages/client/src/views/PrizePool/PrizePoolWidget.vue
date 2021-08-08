<template>
  <div class="flex flex-column flex-center relative pp-w">
    <div class="w-bg absolute-stretch"></div>
    <h1 class="font-outline">Season 1 Prize Pool</h1>

    <IconWithValue
      iconClass="icon-usdc huge"
      valueClass="font-size-4 font-weight-900 font-outline"
      >30000</IconWithValue
    >

    <CustomButton class="margin-top-2" type="yellow">{{
      $t("pp-track")
    }}</CustomButton>
  </div>
</template>

<script>
import IconWithValue from "@/components/IconWithValue.vue";
import CustomButton from "@/components/Button.vue";

export default {
  components: { IconWithValue, CustomButton }
};
</script>

<style lang="less" scoped>
.pp-w {
  padding: 1rem;

  & .w-bg {
    z-index: -1;
    background-image: url("../../assets/shop/shop_packs_pattern1.jpg");
    background-repeat: repeat-x;
    background-size: contain;
    opacity: 0.4;
  }
}
</style>

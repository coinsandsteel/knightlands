<template>
  <div class="flex flex-column flex-center relative pp-w width-100">
    <div class="w-bg absolute-stretch"></div>
    <h1 class="font-outline">Season 1 Prize Pool</h1>

    <IconWithValue
      iconClass="icon-usdc huge"
      valueClass="font-size-4 font-weight-900 font-outline"
      >30000</IconWithValue
    >

    <CustomButton class="margin-top-2" type="yellow" @click="goToPrizePool">{{
      $t("pp-track")
    }}</CustomButton>
  </div>
</template>

<script>
import IconWithValue from "@/components/IconWithValue.vue";
import CustomButton from "@/components/Button.vue";

export default {
  components: { IconWithValue, CustomButton },
  methods: {
    goToPrizePool() {
      this.$router.push({ name: "prize-pool" });
    }
  }
};
</script>

<style lang="less" scoped>
.pp-w {
  padding: 1rem;

  & .w-bg {
    z-index: -1;
    background-image: url("../../assets/shop/shop_packs_pattern4.jpg");
    background-repeat: repeat-x;
    background-size: 8% 100%;
  }
}
</style>

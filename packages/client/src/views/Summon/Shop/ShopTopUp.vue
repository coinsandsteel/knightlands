<template>
  <div class="shop-container">
    <ShiniesShopElement
      v-for="entry in shinies"
      :key="entry.iap"
      :data="entry"
    />
  </div>
</template>

<script>
import ShiniesShopElement from "./ShiniesShopElement.vue";
import Meta from "@/top_up_shop";
import NetworkRequestErrorMixin from "@/components/NetworkRequestErrorMixin.vue";

export default {
  mixins: [NetworkRequestErrorMixin],
  components: { ShiniesShopElement },
  data: () => ({
    shinies: Meta.shinies
  })
};
</script>

<style lang="less" scoped>
.shop-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(30%, 1fr));
  justify-items: center;
}
</style>

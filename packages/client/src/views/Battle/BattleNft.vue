<template>
  <div class="text-align-center">
    <img v-if="url" :src="url" />
  </div>
</template>
<script>
export default {
  props: {
    id: Number
  },
  data() {
    return {};
  },
  computed: {
    url() {
      switch (this.id) {
        case 1:
          return "/images/battle/rewards/nft-1.png";
        case 2:
          return "/images/battle/rewards/nft-2.png";
        case 3:
          return "/images/battle/rewards/nft-3.png";

        default:
          return null;
      }
    }
  }
};
</script>
<style scoped lang="less">
img {
  width: 7rem;
  height: 7rem;
  border-radius: 4px;
}
</style>

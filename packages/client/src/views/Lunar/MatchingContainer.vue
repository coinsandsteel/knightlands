<template>
  <div class="matching-container width-100 padding-bottom-4 relative-position">
    <div class="flex flex-center margin-top-4">
      <Loot />
    </div>
    <div class="flex flex-center margin-top-4">
      <Loot class="margin-left-2 margin-right-2" />
      <Loot class="margin-left-2 margin-right-2" />
      <Loot class="margin-left-2 margin-right-2" />
    </div>
    <div class="text-center margin-top-4">
      <CustomButton type="yellow" class="inline-block margin-right-2">
        Search???
      </CustomButton>
      <CustomButton type="green" class="inline-block">
        Match???
      </CustomButton>
    </div>
    <div
      class="absolute-top-right height-100 flex flex-column flex-justify-center"
    >
      <CustomButton type="grey" class="inline-block margin-right-1">
        Advanced???
      </CustomButton>
      <CustomButton
        type="grey"
        class="inline-block margin-right-2 margin-top-1"
      >
        Expert???
      </CustomButton>
      <CustomButton
        type="grey"
        class="inline-block margin-right-2 margin-top-1"
      >
        NFT???
      </CustomButton>
    </div>
  </div>
</template>
<script>
// import Element from "@/views/Lunar/Element.vue";
import Loot from "@/components/Loot.vue";
import CustomButton from "@/components/Button.vue";
export default {
  components: {
    // Element,
    Loot,
    CustomButton
  },
  data() {
    return {};
  }
};
</script>
<style scoped lang="less">
// .matching-container {
//   height: 168px;
// }
</style>

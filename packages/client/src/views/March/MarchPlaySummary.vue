<template>
  <div class="width-100 height-100 dummy-height flex flex-column flex-no-wrap">
    <div class="flex-full flex flex-center">
      <div class="text-center">
        <div class="font-size-3 font-weight-900 padding-bottom-4">
          Congratulations!???
        </div>
        <div>
          <MarchGold class="inline-block" />
        </div>
        <div>
          <MarchBosses class="inline-block" />
        </div>
      </div>
    </div>
    <div class="padding-top-5 padding-bottom-5">
      <CustomButton
        type="green"
        class="btn-start inline-block"
        @click="$emit('next')"
      >
        To main menu???
      </CustomButton>
    </div>
  </div>
</template>
<script>
import MarchGold from "@/views/March/MarchGold.vue";
import MarchBosses from "@/views/March/MarchBosses.vue";

export default {
  components: {
    MarchGold,
    MarchBosses
  },
  data() {
    return {};
  }
};
</script>
<style scoped lang="less"></style>

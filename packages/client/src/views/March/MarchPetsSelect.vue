<template>
  <div class="width-100 height-100 dummy-height flex flex-column flex-no-wrap">
    <MarchBalance />
    <MarchPetsSlide class="flex-full" />
    <!-- <div class="flex-full">pet</div> -->
    <div class="padding-top-5 padding-bottom-5">
      <CustomButton
        type="yellow"
        class="btn-upgrade inline-block"
        @click="upgradeHandler"
      >
        Upgrade???
      </CustomButton>
      <CustomButton
        type="green"
        class="btn-start inline-block"
        @click="selectHandler"
      >
        Select???
      </CustomButton>
    </div>
    <!-- <div style="inv-root dummy-height full-flex width-100 height-100">333</div> -->
  </div>
</template>
<script>
import MarchBalance from "@/views/March/MarchBalance.vue";
import MarchPetsSlide from "@/views/March/MarchPetsSlide.vue";

export default {
  components: { MarchBalance, MarchPetsSlide },
  data() {
    return {};
  },
  methods: {
    upgradeHandler() {},
    selectHandler() {
      this.$emit("next");
    }
  }
};
</script>
<style scoped lang="less">
.btn-start {
  padding-left: 3rem;
  padding-right: 3rem;
}
</style>

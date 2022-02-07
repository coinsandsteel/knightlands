<template>
  <div class="width-100 height-100 dummy-height flex flex-column flex-no-wrap">
    <MarchBalance />
    <MarchPetsSelect class="flex-full" />
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
        @click="startHandler"
      >
        Select???
      </CustomButton>
    </div>
    <!-- <div style="inv-root dummy-height full-flex width-100 height-100">333</div> -->
  </div>
</template>
<script>
import MarchBalance from "@/views/March/MarchBalance.vue";
import MarchPetsSelect from "@/views/March/MarchPetsSelect.vue";

export default {
  components: { MarchBalance, MarchPetsSelect },
  data() {
    return {};
  },
  methods: {
    upgradeHandler() {},
    startHandler() {}
  }
};
</script>
<style scoped lang="less">
.btn-start {
  padding-left: 3rem;
  padding-right: 3rem;
}
</style>

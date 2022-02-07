<template>
  <div class="width-100 height-100 dummy-height flex flex-column flex-no-wrap">
    <MarchBalance />
    <div class="flex-full width-100 flex flex-center">
      <div>
        <div class="flex flex-justify-center">
          <MarchBoosterButton
            class="btn-booster"
            name="Max health???"
            :price="1000"
            :hasBought="false"
          />
          <MarchBoosterButton
            class="btn-booster margin-left-6"
            name="Extra life???"
            :price="1000"
            :hasBought="true"
          />
        </div>
        <div class="margin-top-6 flex flex-justify-center">
          <MarchBoosterButton
            class="btn-booster"
            name="Key???"
            :price="1000"
            :hasBought="true"
          />
        </div>
      </div>
    </div>
    <!-- <div class="flex-full">pet</div> -->
    <div class="padding-top-5 padding-bottom-5">
      <CustomButton
        type="green"
        class="btn-start inline-block"
        @click="startHandler"
      >
        Start???
      </CustomButton>
    </div>
    <!-- <div style="inv-root dummy-height full-flex width-100 height-100">333</div> -->
  </div>
</template>
<script>
import MarchBalance from "@/views/March/MarchBalance.vue";
// import MarchPetsSlide from "@/views/March/MarchPetsSlide.vue";
import MarchBoosterButton from "@/views/March/MarchBoosterButton.vue";

export default {
  components: { MarchBalance, MarchBoosterButton },
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

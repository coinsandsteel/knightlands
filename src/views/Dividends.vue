<template>
  <div class="divs-content">
    <div class="divs-info-panel margin-bottom-30">
      <div class="flex line flex-space-between">
        <span>Total payout pool:</span>
        <span>99999999999 TRX</span>
      </div>

      <div class="flex line flex-space-between">
        <span>Total staked:</span>
        <span>99999999999999 DKT</span>
      </div>
    </div>

    <div class="divs-info-panel">
      <div class="flex line flex-space-between">
        <div class="flex flex-center flex-basis-50 flex-space-between">
          <span>To claim:</span>
          <span>89 TRX</span>
        </div>

        <div class="common-btn">claim</div>
      </div>
      <div class="flex line flex-space-between">
        <span>Time left until next payout:</span>
        <span>23:59:50</span>
      </div>
    </div>
  </div>
</template>

<script>
import ProgressBar from "@/components/ProgressBar.vue";

export default {
  components: {
    ProgressBar
  },
  mounted() {}
};
</script>

<style lang="less" scoped>
@import "../style/common.less";

.line {
  padding-left: 10px;
  padding-right: 10px;
}

.divs-info-panel {
  background-color: clear;
}
</style>

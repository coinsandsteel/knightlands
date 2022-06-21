<template>
  <div
    class="battle-play-field width-100 height-100 dummy-height flex flex-column flex-no-wrap overflow-hidden"
    :style="{ '--base-size': `${baseSize}px` }"
  >
    <!-- play board -->
    <div
      class="battle-play-board-border-outer _flex _flex-center flex-grow-1 text-align-center font-size-22"
    >
      <div>Rewards</div>
      <div>Crystals: 57</div>
      <div>Your rating: 14 (-3)</div>
      <div>
        <CustomButton
          type="yellow"
          class="inline-block margin-right-2 margin-top-1"
          @click="nextHandler"
        >
          Next
        </CustomButton>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  methods: {
    nextHandler() {}
  }
};
</script>
<style scoped lang="less"></style>

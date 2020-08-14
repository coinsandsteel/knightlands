<template>
  <div class="flex flex-column flex-items-end flex-no-wrap milestone relative">
    <span class="divider relative" :class="{'hidden': points == 0}">
      <span class="center-transform top flex flex-column flex-center">
        <span v-if="points > 0" class="huge margin-bottom-1" :class="`icon-daily-chest${step}`"></span>
        <span class="font-size-18 margin-bottom-half">{{points}}</span>
      </span>
    </span>
  </div>
</template>

<script>
export default {
  props: ["points", "step"]
};
</script>

<style lang="less" scoped>
.milestone {
  height: 100%;

  & .divider {
    width: 8px;
    height: 100%;
    border-image: url("../../assets/ui/progress_bar_tall_divider.png") round;
    border-image-slice: 8 fill;
    border-image-width: 1rem;

    &.hidden {
      background-color: #ffffff00;
    }

    & .top {
      position: absolute;
      bottom: 100%;
    }
  }
}
</style>
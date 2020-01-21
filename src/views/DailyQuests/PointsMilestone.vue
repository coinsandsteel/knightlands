<template>
  <div class="flex flex-column flex-items-end flex-no-wrap milestone relative">
    <span class="divider relative" :class="{'hidden': points == 0}">
      <span class="center-transform top flex flex-column flex-center">
          <span v-if="points > 0" class="icon-chests huge"></span>
        <span class="font-size-18">{{points}}</span>
      </span>
    </span>
  </div>
</template>

<script>
export default {
  props: ["points"]
};
</script>

<style lang="less" scoped>
.milestone {
  height: 100%;

  & .divider {
    width: 0.5rem;
    height: 100%;
    background-color: aquamarine;

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
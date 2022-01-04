<template>
  <div class="element-slot flex relative flex-column  interactible">
    <div class="inner-border item_slot_dark slot_legendary">
      <div slot="reference" class="icon pixelated axe37"></div>
      <div class=""></div>
    </div>
    <span class="unique"></span>
    <span class="icon-physical element"></span>
    <div class="element-quantity flex flex-end flex-items-center">
      <span class="font-size-18 font-weight-700">1</span>
    </div>
    <!---->
  </div>
</template>
<script>
export default {
  name: "Element",
  data() {
    return {};
  }
};
</script>
<style scoped lang="less">
@import (reference) "../../style/common.less";

.element-quantity {
  background: rgba(33, 0, 40, 0.7);
  background: linear-gradient(
    90deg,
    rgba(33, 0, 40, 0) 0%,
    rgba(33, 0, 40, 0.7) 80%,
    rgba(33, 0, 40, 0.3) 100%
  );

  position: absolute;
  bottom: 0.2rem;
  right: 0;
  padding-top: 0.2rem;
  padding-right: 0.6rem;
  left: 0;

  .mobile({bottom: 0.4rem;});

  &.bottom {
    padding-right: 0;
    background: none;
    justify-content: center;
    position: relative;
    transform: translateX(-50%);
    left: 50%;
  }
}

.element-slot {
  position: relative;

  width: @lootCellSize;
  height: @lootCellSize;
  .mobile(
    {width: @mobileLootCellSize; height: @mobileLootCellSize; & > .inner-border {height:
      @mobileLootCellSize * 0.5;}}
  );

  &.small {
    width: @mobileLootCellSize * 0.75;
    height: @mobileLootCellSize * 0.75;

    & > .inner-border {
      height: @mobileLootCellSize * 0.75;
    }
  }

  &.mini {
    width: @mobileLootCellSize * 0.5;
    height: @mobileLootCellSize * 0.5;

    & > .inner-border {
      height: @mobileLootCellSize * 0.5;
    }
  }

  .inner-border {
    position: relative;
    width: 100%;
    padding: 0.7rem;
    height: @lootCellSize;
  }

  pointer-events: none;
  user-select: none;

  &.hintFix {
    // .not-mobile(
    //   {width: @lootCellSize * 1.5; height: @lootCellSize * 1.5; max-height: @lootCellSize *
    //     1.5;}
    // );
    .mobile({max-height: @mobileLootCellSize;});
  }

  &.bottom {
    height: unset;
    min-height: @lootCellSize;
    .mobile({min-height: @mobileLootCellSize;});
  }
}
</style>

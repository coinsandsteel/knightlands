<template>
  <div
    class="relative slot-daily-reward padding-half flex flex-no-wrap flex-items-center flex-column"
    :class="{ slot_selected: active }"
    @click="$emit('hint', reward)"
  >
    <div class="absolute-stretch ticket-background"></div>

    <span
      v-if="!collected"
      class="font-size-22 quantity font-weight-700 font-outline"
      >{{ reward.quantity }}</span
    >

    <div class="absolute-stretch" :class="{ collected: collected }"></div>
    <div class="absolute-stretch active" v-if="active"></div>
  </div>
</template>

<script>
export default {
  props: ["reward", "index", "current", "collected"],
  computed: {
    active() {
      return this.current;
    }
  }
};
</script>

<style lang="less" scoped>
@import (reference) "../../style/ui.less";
@import (reference) "../../style/common.less";

.active {
  background-image: url("../../assets/ui/slot_selected.png");
  position: relative;
  background-size: contain;
  background-repeat: no-repeat;
}

.collected {
  .checkbox_tick;
  .icon();
}

.slot-daily-reward {
  position: relative;
  .slot_effect;

  width: @lootCellSize;
  height: @lootCellSize;
  margin-bottom: 3rem;

  &.active {
    .slot_effect_green;
  }
}
.ticket-background {
  background-repeat: no-repeat;
  background-image: url("/images/march/march_tickets.png");
  background-size: 100%;
  transform: scale(0.5, 0.5);
}

.iicon {
  width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.trans {
  opacity: 0.3;
}

.quantity {
  z-index: 1;
  top: 0.4rem;
  right: 0.2rem;
  position: absolute;
}

.day {
  width: 100%;
  position: absolute;
  bottom: 0;
  transform: translateY(100%);
  left: 0;
}
</style>

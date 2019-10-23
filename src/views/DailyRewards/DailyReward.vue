<template>
  <div
    class="relative slot-daily-reward padding-top-half flex flex-no-wrap flex-items-center flex-column"
    :class="{active:active}"
    @click="$emit('hint', reward)"
  >
    <img :class="{trans: collected}" class="icon" :src="icon" />

    <span
      v-if="!collected"
      class="font-size-22 quantity font-weight-700 font-outline"
    >{{reward.minCount}}</span>

    <span
      :class="{trans: collected}"
      class="font-size-18 font-weight-700 font-outline"
    >{{$t("daily-reward-day", {day: index+1})}}</span>

    <div class="absolute-stretch" :class="{collected: collected}"></div>
    <div class="absolute-stretch active" v-if="active"></div>
  </div>
</template>

<script>
export default {
  props: ["reward", "index", "current", "collected"],
  computed: {
    icon() {
      return this.$game.itemsDB.getIcon(this.reward.itemId);
    },
    active() {
      return this.current;
    }
  }
};
</script>

<style lang="less" scoped>
@import (reference) "../../style/common.less";

.active {
  background-image: url("../../assets/ui/slot_selected.png");
  position: relative;
  background-size: contain;
  background-repeat: no-repeat;
}

.collected {
  background-image: url("../../assets/ui/checkbox_tick.png");
  background-size: 50%;
  background-position: center;
  background-repeat: no-repeat;
}

.slot-daily-reward {
  position: relative;
  background-image: url("../../assets/ui/slot_effect.png");
  background-size: contain;
  background-repeat: no-repeat;

  width: @lootCellSize;
  height: @lootCellSize;
  margin-bottom: 3rem;

  &.active {
    background-image: url("../../assets/ui/slot_effect_green.png");
  }
}

.icon {
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
</style>
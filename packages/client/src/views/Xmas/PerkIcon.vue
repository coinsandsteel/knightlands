<template>
  <div class="relative">
    <div :style="icon" class="perk-icon"></div>
    <div class="perk-locked" v-if="locked"></div>
    <div class="perk-lvl font-size-18 flex flex-center">{{ level }}</div>
  </div>
</template>

<script>
import {
  TOWER_PERK_AUTOCYCLES_COUNT,
  TOWER_PERK_BOOST,
  TOWER_PERK_SUPER_BOOST,
  TOWER_PERK_CYCLE_DURATION,
  TOWER_PERK_INCOME,
  TOWER_PERK_UPGRADE,
  TOWER_PERK_SPEED,
  TOWER_PERK_SUPER_SPEED,
  TOWER_PERK_PRESENT,
  TOWER_PERK_SLEEP
} from "@/../../knightlands-shared/xmas";

const ICONS = {
  [TOWER_PERK_AUTOCYCLES_COUNT]: "perk07",
  [TOWER_PERK_BOOST]: "perk01",
  [TOWER_PERK_SUPER_BOOST]: "perk02",
  [TOWER_PERK_CYCLE_DURATION]: "perk08",
  [TOWER_PERK_INCOME]: "perk09",
  [TOWER_PERK_UPGRADE]: "perk10",
  [TOWER_PERK_SPEED]: "perk03",
  [TOWER_PERK_SUPER_SPEED]: "perk04",
  [TOWER_PERK_PRESENT]: "perk06",
  [TOWER_PERK_SLEEP]: "perk05"
};

export default {
  props: ["perk", "level", "locked"],
  computed: {
    icon() {
      return {
        opacity: this.locked ? "0.75" : "1",
        "background-image": `url(/images/xmas/perks/${ICONS[this.perk]}.png)`
      };
    }
  }
};
</script>

<style lang="less" scoped>
@import (reference) "../../style/ui.less";

.perk-icon {
  background-repeat: no-repeat;
  background-size: contain;
  width: 5rem;
  height: 5rem;
}

.perk-lvl {
  background-image: url("../../assets/ui/perk_lvl.png");
  background-repeat: no-repeat;
  background-size: contain;
  width: 3rem;
  height: 3rem;
  position: absolute;
  top: 0rem;
  left: -1rem;
}

.perk-locked {
  .icon_lock_big;
  width: 3rem;
  height: 3rem;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
}
</style>

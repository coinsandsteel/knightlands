<template>
  <div :style="icon" class="perk-icon"></div>
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
  TOWER_PERK_SUPER_SPEED
} from "@/../../knightlands-shared/xmas";

const ICONS = {
  [TOWER_PERK_AUTOCYCLES_COUNT]: "perk01",
  [TOWER_PERK_BOOST]: "perk02",
  [TOWER_PERK_SUPER_BOOST]: "perk03",
  [TOWER_PERK_CYCLE_DURATION]: "perk04",
  [TOWER_PERK_INCOME]: "perk05",
  [TOWER_PERK_UPGRADE]: "perk06",
  [TOWER_PERK_SPEED]: "perk07",
  [TOWER_PERK_SUPER_SPEED]: "perk08"
};

export default {
  props: ["perk"],
  computed: {
    icon() {
      return {
        "background-image": `url(/images/xmas/perks/${ICONS[this.perk]}.png)`
      };
    }
  }
};
</script>

<style lang="less" scoped>
.perk-icon {
  background-repeat: no-repeat;
  background-size: contain;
  width: 5rem;
  height: 5rem;
}
</style>

<template>
  <div
    class="loot-slot flex relative flex-column"
    :class="`slot-${rarity}`"
    @click="$emit('click')"
  >
    <div class="inner-border">
      <div :class="{'locked': finished}">
        <slot></slot>
      </div>
      <div :class="[{'selected': selected}]"></div>
    </div>
  </div>
</template>

<script>
export default {
    props: ["selected", "icon", "rarity", "finished"]
}
</script>

<style lang="less" scoped>
@import (reference) "../../style/common.less";

.loot-slot {
  position: relative;
  background-image: url("../../assets/ui/item_slot_dark.png");
  background-size: contain;
  background-repeat: no-repeat;

  width: @lootCellSize;
  height: @lootCellSize;
  .mobile({width: @mobileLootCellSize; height: @mobileLootCellSize;});

  .inner-border {
    position: relative;
    width: (100%);
  }
}

.locked {
  filter: grayscale(100%) brightness(80%);
}

.slot-common {
  background-image: url("../../assets/ui/slot_common.png");
}

.slot-rare {
  background-image: url("../../assets/ui/slot_rare.png");
}

.slot-epic {
  background-image: url("../../assets/ui/slot_epic.png");
}

.slot-legendary {
  background-image: url("../../assets/ui/slot_legendary.png");
}

.slot-mythical {
  background-image: url("../../assets/ui/slot_mythical.png");
}

.selected {
  background-image: url("../../assets/ui/slot_selected.png");
  background-repeat: no-repeat;
  background-size: contain;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}
</style>
<template>
  <div
    class="flex flex-column flex-center flex-start"
    @click="$emit('click', id)"
    :class="{ pointer: id }"
  >
    <span class="font-size-20 font-weight-900" v-html="damage"></span>
    <div class="loot-slot  flex relative flex-column ">
      <div class="inner-border item_slot_dark" :class="rarity">
        <div
          :style="icon"
          class="icon"
          :class="!icon ? `icon_slot_${type}` : null"
        />
        <div :class="[{ selected: selected }]"></div>
      </div>
    </div>
    <span :class="[moveIcon]" class="empty-icon big"></span>
  </div>
</template>

<script>
import DungeonItems from "@/metadata/halloween/dungeon_items.json";
import { MoveType } from "@/../../knightlands-shared/dungeon_types";

export default {
  props: ["id", "selected", "type"],
  computed: {
    rarity() {
      if (!this.id) {
        return "";
      }

      return `slot_${DungeonItems[this.id].rarity}`;
    },
    damage() {
      if (!this.id) {
        return "&nbsp;";
      }

      return "DMG " + DungeonItems[this.id].modifier * 100 + "%";
    },
    icon() {
      if (!this.id) {
        return "";
      }

      return {
        "background-image": `url("/images/halloween_assets/items/${
          DungeonItems[this.id].image
        }.png")`
      };
    },
    emptyIcon() {
      if (!this.id) {
        return "&nbsp;";
      }
      return "";
    },
    moveIcon() {
      if (!this.id) {
        return "";
      }

      switch (DungeonItems[this.id].move) {
        case MoveType.Scissors:
          return "d-das";

        case MoveType.Paper:
          return "d-blo";

        case MoveType.Rock:
          return "d-sla";
      }

      return "";
    }
  }
};
</script>

<style lang="less" scoped>
@import (reference) "../../../style/common.less";

.loot-slot {
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

  &.bottom {
    height: unset;
    min-height: @lootCellSize;
    .mobile({min-height: @mobileLootCellSize;});
  }
}

.slot-border {
  background-repeat: no-repeat;
  background-size: contain;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}

.selected {
  background-image: url("../../../assets/ui/slot_selected.png");
  background-repeat: no-repeat;
  background-size: contain;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}

.icon {
  width: 100%;
  height: 100%;
}
</style>

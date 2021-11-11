<template>
  <div
    class="loot-slot  flex relative flex-column "
    @click="handleHint"
    :class="[{ interactible: interactible }, { bottom: gacha }, size]"
  >
    <div class="inner-border item_slot_dark" :class="rarity">
      <div
        :class="[{ locked: locked }, icon]"
        class="icon pixelated"
        slot="reference"
      />
      <div :class="[{ selected: selected }]"></div>
      <!-- <div class="slot-border" :class="rarity"></div> -->
    </div>

    <template v-if="!onlyIcon">
      <span
        v-if="showUnique && !showUnbindLevels && itemData && itemData.unique"
        class="unique"
      ></span>

      <span
        v-if="showEquipped && itemData && itemData.equipped"
        class="equipped"
        :class="{ 'on-unit': isEquippedOnUnit }"
      ></span>
      <span v-else-if="itemData" :class="`icon-${element} element`"></span>

      <div class="icon-locked" v-if="showLocked && itemData && itemData.locked">
        <span class="icon-locked-corner" />
        <span class="icon-locked-text"></span>
      </div>

      <div
        class="flex flex-center width-100 flex-evenly-spaced stars-container"
        :class="{ top: showLevel && itemData }"
        v-if="showUnbindLevels"
      >
        <span
          class="star mini"
          :class="{ active: itemData && itemData.breakLimit >= 1 }"
        ></span>
        <span
          class="star mini"
          :class="{ active: itemData && itemData.breakLimit >= 2 }"
        ></span>
      </div>

      <div
        class="loot-quantity flex flex-end flex-items-center"
        :class="{ bottom: gacha }"
        v-if="!hideQuantity && (gacha || (itemData && !equipment && count > 0))"
      >
        <span class="font-size-18 font-weight-700">{{ countCompact }}</span>
      </div>

      <div v-if="showLevel && itemData" class="item-level">
        <span class="font-size-18 font-weight-700">{{
          $t("level", { lvl: itemData.level || 1 })
        }}</span>
      </div>

      <slot></slot>
    </template>
  </div>
</template>

<script>
const { EquipmentSlots } = require("@/../../knightlands-shared/equipment_slot");

let SlotPlaceholders = {};
SlotPlaceholders[EquipmentSlots.MainHand] = "icon_slot_mainhand";
SlotPlaceholders[EquipmentSlots.Helmet] = "icon_slot_helmet";
SlotPlaceholders[EquipmentSlots.Chest] = "icon_slot_chest";
SlotPlaceholders[EquipmentSlots.Gloves] = "icon_slot_gloves";
SlotPlaceholders[EquipmentSlots.Cape] = "icon_slot_cloak";
SlotPlaceholders[EquipmentSlots.Boots] = "icon_slot_boots";
SlotPlaceholders[EquipmentSlots.Ring] = "icon_slot_ring";
SlotPlaceholders[EquipmentSlots.Necklace] = "icon_slot_accessory";
SlotPlaceholders[EquipmentSlots.Pet] = "icon_slot_pet";
SlotPlaceholders[EquipmentSlots.OffHand] = "icon_slot_offhand";

export default {
  props: {
    item: [Object, Number, String],
    interactible: {
      type: Boolean,
      default: true
    },
    inventory: {
      type: Boolean,
      default: false
    },
    equipment: {
      type: Boolean,
      default: false
    },
    equipmentSlot: {
      type: String
    },
    gacha: {
      type: Boolean,
      default: false
    },
    quantity: {
      type: Number,
      default: -1
    },
    size: {
      type: String,
      default: ""
    },
    hideQuantity: Boolean,
    locked: Boolean,
    selected: Boolean,
    showUnbindLevels: Boolean,
    showLevel: Boolean,
    showUnique: {
      type: Boolean,
      default: true
    },
    showEquipped: {
      type: Boolean,
      default: true
    },
    showLocked: {
      type: Boolean,
      default: true
    },
    onlyIcon: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      itemData: undefined
    };
  },
  watch: {
    item() {
      this.updateItemData();
    }
  },
  mounted() {
    this.updateItemData();
  },
  computed: {
    isEquippedOnUnit() {
      if (!this.itemData) {
        return false;
      }

      return this.itemData.holder != -1;
    },
    itemKey() {
      return !this.itemData ? "" : `${this.itemData.template}`;
    },
    rarity() {
      if (!this.itemData) {
        return "";
      }

      return `slot_${this.$game.itemsDB.getRarity(this.itemData)}`;
    },
    element() {
      return this.$game.itemsDB.getElement(this.item);
    },
    count() {
      let count = this.quantity;
      // prioritize explicit quantity
      if (count == -1 && this.itemData) {
        return this.itemData.count;
      }

      if (count == -1) {
        count = 1;
      }

      return count;
    },
    countCompact() {
      const count = this.count;
      let loc = "";
      let value = count;

      if (Math.floor(count / 1e9) > 0) {
        loc = "cb";
        value = Math.floor((count / 1e9) * 10) / 10;
      } else if (Math.floor(count / 1e6) > 0) {
        loc = "cm";
        value = Math.floor((count / 1e6) * 10) / 10;
      } else if (Math.floor(count / 1e3) > 0) {
        loc = "ck";
        value = Math.floor((count / 1e3) * 10) / 10;
      }

      if (loc) {
        return this.$t(loc, { x: value });
      }

      return `${count}`;
    },
    icon() {
      if ((!this.itemData || !this.itemData.id) && this.equipment) {
        return SlotPlaceholders[this.equipmentSlot];
      }
      if (this.itemData) {
        return this.$game.itemsDB.getIcon(
          this.itemData.template,
          this.$game.itemsDB.getRarity(this.itemData)
        );
      }

      return "";
    }
  },
  methods: {
    handleHint() {
      this.$emit("hint", this.itemData);
    },
    updateItemData() {
      if (this.item && typeof this.item !== "object") {
        // template
        let template = this.$game.itemsDB.getTemplate(+this.item);
        if (template) {
          this.itemData = {
            template: this.item * 1,
            equipped: false,
            level: 1,
            count:
              Math.floor(this.quantity * (template.quantity || 1) * 100) / 100
          };
        }
      } else {
        this.itemData = this.item;
      }
    }
  }
};
</script>

<style lang="less" scoped>
@import (reference) "../style/common.less";

.loot-quantity {
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

.slot-border {
  background-repeat: no-repeat;
  background-size: contain;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}

.loot-equipped {
  background-image: url("../assets/ui/slot_selected.png");
  background-repeat: no-repeat;
  background-size: contain;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}

.selected {
  background-image: url("../assets/ui/slot_selected.png");
  background-repeat: no-repeat;
  background-size: contain;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}

.interactible {
  &:hover {
    cursor: pointer;
  }

  &:active {
    background-color: #607279;
  }

  pointer-events: all;
}

.icon {
  width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.locked {
  filter: grayscale(100%) brightness(40%) sepia(100%) hue-rotate(-50deg)
    saturate(600%) contrast(0.8);
}

.stars-container {
  position: absolute;
  bottom: 0.5rem;
  left: 0;
  right: 0;

  &.top {
    bottom: unset;
    top: 0.5rem;
  }
}

.unique {
  .icon_moded4;
  width: 2rem !important;
  height: 2rem !important;
  position: absolute;
  top: 0.5rem;
  right: 0rem;
}

.equipped {
  .icon_equipped1;
  width: 2rem !important;
  height: 2rem !important;
  position: absolute;
  top: 0.4rem;
  left: 0rem;

  &.on-unit {
    .icon_equipped;
  }
}

.icon-locked {
  position: absolute;
  top: 0.2rem;
  left: 0;
}

.icon-locked-corner {
  width: 0;
  height: 0;
  position: absolute;
  top: 0;
  left: 0;
}

.element {
  position: absolute;
  top: 0.4rem;
  left: 0rem;
}

.item-level {
  background: rgba(33, 0, 40, 0.7);
  background: linear-gradient(
    90deg,
    rgba(33, 0, 40, 0.3) 0%,
    rgba(33, 0, 40, 0.7) 80%,
    rgba(33, 0, 40, 0.3) 100%
  );

  position: absolute;
  bottom: 0.2rem;
  width: 100%;
  transform: translateX(-50%);
  left: 50%;
}
</style>

<template>
  <div
    class="loot-slot flex relative flex-column"
    @click="$emit('hint', itemData)"
    :class="[rarity,{interactible: interactible}, {'bottom': gacha}, size]"
  >
    <div class="inner-border">
      <img :class="{'locked': locked}" class="icon" :src="icon()" slot="reference" />
      <div :class="[{'loot-equipped':(inventory && equipped)}, {'selected': selected}]"></div>
      <!-- <div class="slot-border" :class="rarity"></div> -->
    </div>

    <template v-if="!onlyIcon">
      <span v-if="!showUnbindLevels && itemData && itemData.unique" class="unique"></span>

      <div class="flex flex-center width-100 flex-evenly-spaced stars-container" :class="{top: showLevel && itemData}" v-if="showUnbindLevels">
        <span class="star" :class="{active: itemData && itemData.breakLimit>=1}"></span>
        <span class="star" :class="{active: itemData && itemData.breakLimit>=2}"></span>
      </div>

      <div class="loot-quantity" :class="{'bottom': gacha}" v-else>
        <span
          v-if="!hideQuantity && (gacha || (itemData && !equipment && count > 0))"
          class="font-size-18 font-weight-700 digit-font font-outline"
        >{{count}}</span>
      </div>

      <div v-if="showLevel && itemData && itemData.level > 1" class="item-level">
        <span class="font-size-18 digit-font font-outline">Lvl:{{itemData.level || 1}}</span>
      </div>
    </template>
  </div>
</template>

<script>
const { EquipmentSlots } = require("@/../knightlands-shared/equipment_slot");
import Stat from "@/../knightlands-shared/character_stat.js";

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
    quantity: Number,
    size: {
      type: String,
      default: ""
    },
    hideQuantity: Boolean,
    locked: Boolean,
    selected: Boolean,
    showUnbindLevels: Boolean,
    showLevel: Boolean,
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
    itemKey() {
      return !this.itemData ? "" : `${this.itemData.template}`;
    },
    rarity() {
      if (!this.itemData) {
        return "";
      }

      return `slot-${this.$game.itemsDB.getRarity(this.itemData.template)}`;
    },
    count() {
      if (!this.itemData) {
        return 1;
      }

      return this.itemData.count || 1;
    },
    equipped() {
      if (!this.itemData) {
        return false;
      }

      return !!this.itemData.equipped;
    }
  },
  methods: {
    updateItemData() {
      if (this.item && typeof this.item !== "object") {
        // template
        let template = this.$game.itemsDB.getTemplate(this.item * 1);
        if (template) {
          this.itemData = {
            template: this.item * 1,
            equipped: false,
            count: this.quantity || template.quantity,
            level: 1
          };
        }
      } else {
        this.itemData = this.item;
      }
    },
    icon() {
      if ((!this.itemData || !this.itemData.id) && this.equipment) {
        return `/images/ui/equipment/${
          SlotPlaceholders[this.equipmentSlot]
        }.png`;
      }

      if (this.itemData) {
        return this.$game.itemsDB.getIcon(this.itemData.template);
      }

      return "";
    }
  }
};
</script>


<style lang="less" scoped>
@import (reference) "../style/common.less";

.loot-quantity {
  position: absolute;
  bottom: 0.2rem;
  right: 0.6rem;

  .mobile({bottom: 0.4rem; right: 0.8rem;});

  &.bottom {
    position: relative;
    transform: translateX(-50%);
    left: 50%;
  }
}

.loot-slot {
  position: relative;
  background-image: url("../assets/ui/item_slot_dark.png");
  background-size: contain;
  background-repeat: no-repeat;

  width: @lootCellSize;
  height: @lootCellSize;
  .mobile({width: @mobileLootCellSize; height: @mobileLootCellSize;});

  &.small {
    .mobile(
      {width: @mobileLootCellSize * 0.75; height: @mobileLootCellSize * 0.75;}
    );
  }

  &.mini {
    .mobile(
      {width: @mobileLootCellSize * 0.5; height: @mobileLootCellSize * 0.5;}
    );

    width: @lootCellSize * 0.75;
    height: @lootCellSize * 0.75;
  }

  .inner-border {
    position: relative;
    width: (100%);
    padding: 0.5rem;
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

.slot-common {
  background-image: url("../assets/ui/slot_common.png");
}

.slot-rare {
  background-image: url("../assets/ui/slot_rare.png");
}

.slot-epic {
  background-image: url("../assets/ui/slot_epic.png");
}

.slot-legendary {
  background-image: url("../assets/ui/slot_legendary.png");
}

.slot-mythical {
  background-image: url("../assets/ui/slot_mythical.png");
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
  bottom: 1rem;
  left: 0;
  right: 0;

  &.top {
    bottom: unset;
    top: 1rem;
  }
}

.unique {
  background-image: url("../assets/ui/icon_moded4.png");
  background-repeat: no-repeat;
  background-size: contain;
  width: 20px;
  height: 20px;
  position: absolute;
  top: 0rem;
  right: 0rem;
}

.item-level {
  position: absolute;
  bottom: 0.2rem;
  width: 100%;
  transform: translateX(-50%);
  left: 50%;
}
</style>

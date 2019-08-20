<template>
  <div
    class="loot-slot flex relative flex-column"
    @click="$emit('hint', itemData)"
    :class="[rarity,{interactible: interactible}, {'bottom': gacha}]"
  >
    <div class="inner-border">
      <img class="icon" :src="icon()" slot="reference" />
      <div :class="{'loot-equipped':(inventory && equipped)}"></div>
      <!-- <div class="slot-border" :class="rarity"></div> -->
    </div>

    <div class="loot-quantity" :class="{'bottom': gacha}">
      <span
        v-if="gacha || (itemData && !equipment && count > 0)"
        class="font-size-20 digit-font font-outline"
      >{{count}}</span>
    </div>
  </div>
</template>

<script>
const { EquipmentSlots } = require("@/../knightlands-shared/equipment_slot");
import Stat from "@/../knightlands-shared/character_stat.js";
import { Flipped } from "vue-flip-toolkit";

/*
    Item's properties
        Stats - array of stats
            Stat's properties
                ID
                Value
        Quantity - integer >1
        Type - item type
        ID - id of the view used in UI, includes images and localisation 
*/

let SlotPlaceholders = {};
SlotPlaceholders[EquipmentSlots.MainHand] = "icon_slot_mainhand";
SlotPlaceholders[EquipmentSlots.Helmet] = "icon_slot_helmet";
SlotPlaceholders[EquipmentSlots.Chest] = "icon_slot_chest";
SlotPlaceholders[EquipmentSlots.Gloves] = "icon_slot_gloves";
SlotPlaceholders[EquipmentSlots.Cape] = "icon_slot_cape";
SlotPlaceholders[EquipmentSlots.Boots] = "icon_slot_boots";
SlotPlaceholders[EquipmentSlots.Ring] = "icon_slot_ring";
SlotPlaceholders[EquipmentSlots.Necklace] = "icon_slot_accessory";
SlotPlaceholders[EquipmentSlots.Pet] = "icon_slot_pet";
SlotPlaceholders[EquipmentSlots.OffHand] = "icon_slot_offhand";

export default {
  components: { Flipped },
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
    quantity: Number
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
        return 0;
      }

      return this.itemData.count;
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
      if (typeof this.item !== "object") {
        // template
        let template = this.$game.itemsDB.getTemplate(this.item * 1);
        this.itemData = {
          template: this.item * 1,
          equipped: false,
          count: template.quantity || this.quantity
        };
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

  .mobile({bottom: 0.6rem; right: 0.8rem;});

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
  // .big_retina({width: 40px; height: 40px;});

  .inner-border {
    position: relative;
    width: (100%);
    padding: 0.5rem;
  }

  pointer-events: none;
  user-select: none;

  &.hintFix {
    max-height: @lootCellSize;
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
  background-image: url("../assets/ui/button_highlighted.png");
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
</style>

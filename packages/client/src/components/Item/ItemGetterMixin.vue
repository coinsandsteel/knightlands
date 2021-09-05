<script>
const ItemType = require("@/../../knightlands-shared/item_type");
const {
  EquipmentSlots,
  getSlot
} = require("@/../../knightlands-shared/equipment_slot");
const ItemActions = require("@/../../knightlands-shared/item_actions");

export default {
  props: ["item", "matchItem", "target"],
  computed: {
    count() {
      if (!this.item) {
        return -1;
      }

      return this.item.count;
    },
    level() {
      if (!this.item) {
        return 1;
      }

      if (this.matchItem) {
        return Math.min(
          this.matchItem.level,
          this.$game.itemsDB.getMaxLevel(this.item, this.stars)
        );
      }

      return this.item.level;
    },
    stars() {
      if (!this.item) {
        return 0;
      }

      if (this.matchItem) {
        return this.matchItem.breakLimit;
      }

      return this.item.breakLimit;
    },
    template() {
      if (!this.item) {
        return {};
      }
      return this.$game.itemsDB.getTemplate(this.item);
    },
    element() {
      return this.$game.itemsDB.getElement(this.item);
    },
    elementIcon() {
      return `icon-${this.element}`;
    },
    hasElement() {
      if (this.template.type != ItemType.Equipment) {
        return false;
      }

      if (this.slot != EquipmentSlots.MainHand) {
        return false;
      }

      return this.element != "physical";
    },
    name() {
      return this.$t(this.template.caption);
    },
    desc() {
      return this.$t(this.template.description, "");
    },
    type() {
      let type = this.template.type;
      if (this.template.type == ItemType.Equipment) {
        type = this.template.equipmentType;
      }

      return `${this.$t(this.template.rarity)} ${this.$t(type)}`;
    },
    enchant() {
      if (!this.item) {
        return 0;
      }

      return this.item.enchant || 0;
    },
    stats() {
      if (!this.item) {
        return [];
      }

      let forceLevel = 0;
      let forceEnchanting = 0;
      if (this.matchItem) {
        forceLevel = this.level;
        forceEnchanting = this.matchItem.enchanting;
      }

      return this.$game.itemsDB.getStats(
        this.item,
        forceLevel,
        forceEnchanting
      );
    },
    rarityClass() {
      return `rarity-${this.$game.itemsDB.getRarity(this.item)}`;
    },
    isEquipment() {
      return this.template.type == ItemType.Equipment;
    },
    isConsumable() {
      return this.template.type == ItemType.Consumable;
    },
    isOffHand() {
      if (!this.isEquipment) {
        return false;
      }

      return this.slot == EquipmentSlots.OffHand;
    },
    isBox() {
      if (!this.isConsumable) {
        return false;
      }

      return this.template.action.action == ItemActions.OpenBox;
    },
    isSummon() {
      if (!this.isConsumable) {
        return false;
      }

      return this.template.action.action == ItemActions.SummonUnit;
    },
    nextExp() {
      return this.$game.itemsDB.getNextExp(this.item.level);
    },
    maxLevel() {
      return this.$game.itemsDB.getMaxLevel(this.item);
    },
    caption() {
      return this.template.caption;
    },
    slot() {
      return getSlot(this.template.equipmentType);
    },
    matchedWithOtherItem() {
      return this.matchItem && this.matchItem.id != this.item.id;
    },
    actionMinLevel() {
      if (!this.template.action) {
        return 0;
      }
      return this.template.action.minLevel;
    },
    levelRequired() {
      return this.level * 2;
    },
    canWear() {
      let level = (this.target || this.$game.character).level;
      return this.levelRequired <= level;
    },
    maxStack() {
      return this.template.maxStack;
    }
  }
};
</script>

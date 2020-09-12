<script>
const ItemType = require("@/../../knightlands-shared/item_type");
const {
  EquipmentSlots,
  getSlot
} = require("@/../../knightlands-shared/equipment_slot");
const ItemActions = require("@/../../knightlands-shared/item_actions");

export default {
  props: ["item", "matchItem"],
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
        return this.matchItem.level;
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
    stats() {
      if (!this.item) {
        return [];
      }

      let forceLevel = 0;
      let forceEnchanting = 0;
      if (this.matchItem) {
        forceLevel = this.matchItem.level;
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
    }
  }
};
</script>

<script>
const ItemType = require("@/../../knightlands-shared/item_type");
const {
  EquipmentSlots,
  getSlot
} = require("@/../../knightlands-shared/equipment_slot");
const ItemActions = require("@/../../knightlands-shared/item_actions");

export default {
  computed: {
    stars() {
      if (!this.item) {
        return 0;
      }
      return this.item.breakLimit;
    },
    template() {
      if (!this.item) {
        return {};
      }
      return this.$game.itemsDB.getTemplate(this.item);
    },
    elementIcon() {
      return `icon-${this.template.element}`;
    },
    hasElement() {
      if (this.template.type != ItemType.Equipment) {
        return false;
      }

      if (getSlot(this.template.equipmentType) != EquipmentSlots.MainHand) {
        return false;
      }

      return this.template.element != "physical";
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
      return this.$game.itemsDB.getStats(this.item);
    },
    isEquipment() {
      return this.template.type == ItemType.Equipment;
    },
    isConsumable() {
      return this.template.type == ItemType.Consumable;
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
    }
  }
};
</script>

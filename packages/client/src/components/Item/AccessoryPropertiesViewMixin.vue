<script>
import CraftAccessories from "@/craft_accessories";
import AccessoryOption from "@/../../knightlands-shared/accessory_option";
const { EquipmentSlots } = require("@/../../knightlands-shared/equipment_slot");

const rangesTemplate = "<span>(min - max) </span>";

export default {
  methods: {
    _getPropValue(value, relative) {
      if (relative) {
        return Math.floor(value * 100 * 1000) / 1000;
      }
      return value;
    },
    viewAccessoryProps(item, options = {}) {
      const isRing =
        this.$game.itemsDB.getSlot(this.item.template) == EquipmentSlots.Ring;
      const meta = isRing ? CraftAccessories.ring : CraftAccessories.necklace;

      const length = item.properties.length;
      let props = new Array(length);
      for (let i = 0; i < length; ++i) {
        const property = item.properties[i];
        const propertyTemplate = meta.options[property.id];
        const locParams = { ...property };

        let relative = true;
        switch (propertyTemplate.type) {
          case AccessoryOption.GoldOnHitInRaid:
          case AccessoryOption.ExpOnHitInRaid:
            relative = false;
            break;
        }

        if (options.prevProps) {
          locParams.value = this._getPropValue(locParams.prevValue, relative);
        } else {
          locParams.value = this._getPropValue(locParams.value, relative);
        }

        if (locParams.element) {
          locParams.element = this.$t(`e-${locParams.element}`);
        }

        const locKey = `o-${propertyTemplate.type}`;

        if (options.showRange) {
          const option = meta.options[property.id];
          const range = option.ranges.find(x => x.rarity == item.rarity);
          props[i] =
            rangesTemplate
              .replace("min", this._getPropValue(range.minValue, relative))
              .replace("max", this._getPropValue(range.maxValue, relative)) +
            this.$t(locKey, locParams);
        } else {
          props[i] = this.$t(locKey, locParams);
        }
      }
      return props;
    }
  }
};
</script>

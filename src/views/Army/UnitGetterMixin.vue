<script>
import UiConstants from "@/ui_constants";
import ArmyUnitTypes from "@/army_unit_types";

export default {
  computed: {
    stars() {
      if (this.unit) {
        return this.$game.armyDB.getStars(this.unit);
      }

      return 0;
    },
    element() {
      if (this.unit) {
        return this.$game.armyDB.getElement(this.unit);
      }
      return "";
    },
    level() {
      if (this.unit) {
        return this.unit.level;
      }
      return 0;
    },
    maxLevel() {
      if (this.unit) {
        return this.$game.armyDB.getMaxLevel(this.unit);
      }
      return 0;
    },
    nextMaxLevel() {
      if (this.unit) {
        return this.$game.armyDB.getMaxLevel(this.unit, true);
      }
      return 0;
    },
    unitImage() {
      if (this.unit) {
        return UiConstants.backgroundImage(this.unitIcon);
      }

      return "";
    },
    unitIcon() {
      return this.$game.armyDB.getIcon(this.unit);
    },
    unitType() {
      if (this.unit) {
        return ArmyUnitTypes[this.$game.armyDB.getUnitType(this.unit)];
      }
      return "";
    },
    name() {
      if (this.unit) {
        return this.$game.armyDB.getName(this.unit);
      }
      return "";
    },
    weaponType() {
      if (this.unit) {
        return this.$game.armyDB.getWeaponType(this.unit);
      }
      return "";
    },
    abilities() {
      if (this.unit) {
        return this.$game.armyDB.getAbilities(this.unit);
      }
      return [];
    },
    damage() {
      if (this.unit) {
        return this.$game.armyDB.getDamage(this.unit);
      }

      return 0;
    },
    nextDamage() {
      if (this.unit) {
        return this.$game.armyDB.getDamage(this.unit, true);
      }

      return 0;
    }
  },
  methods: {
    getAbilityDesc(ability) {
      const levelValue = this.$game.armyDB.getAbilityLevelValue(
        this.unit,
        ability.id
      );

      const localisationParams = { value: levelValue, ...ability };
      if (ability.unitType) {
        localisationParams.unitType = this.$t(ArmyUnitTypes[ability.unitType]);
      }

      return this.$t(ability.type, localisationParams);
    }
  }
};
</script>

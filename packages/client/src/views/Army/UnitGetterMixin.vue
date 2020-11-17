<script>
import UiConstants from "@/ui_constants";
import ArmyUnitTypes from "@/army_unit_types";
import RaidsMeta from "@/raids_meta";

export default {
  computed: {
    stars() {
      if (this.unit) {
        return this.$game.army.getStars(this.unit);
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
        return UiConstants.backgroundImage(
          this.$game.armyDB.getImage(this.unit)
        );
      }

      return "";
    },
    unitIcon() {
      return UiConstants.backgroundImage(this.$game.armyDB.getIcon(this.unit));
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
    estimatedDamage() {
      if (this.unit) {
        return this.$game.army.estimateDamage(this.unit);
      }

      return 0;
    },
    damage() {
      if (this.unit) {
        return this.$game.army.getDamage(this.unit);
      }

      return 0;
    },
    nextDamage() {
      if (this.unit) {
        return this.$game.army.getDamage(this.unit, true);
      }

      return 0;
    },
    nextPromotionDamage() {
      if (this.unit) {
        return this.$game.army.getDamage(this.unit, false, true);
      }

      return 0;
    }
  },
  methods: {
    getAbilityDesc(ability, overrideUnit) {
      const levelValue = this.$game.army.getAbilityLevelValue(
        this.unit || overrideUnit,
        ability.id
      );

      const localisationParams = { value: levelValue, ...ability };
      if (ability.unitType) {
        localisationParams.unitType = this.$t(ArmyUnitTypes[ability.unitType]);
      }

      if (ability.stars) {
        // create stars html
        localisationParams.stars = `<div class="flex flex-no-wrap flex-item-center"><div class="star active small"></div><span class="digit-font">${ability.stars}</span></div>`;
      }

      if (ability.raid) {
        localisationParams.raid = this.$t(RaidsMeta[ability.raid].name);
      }

      if (ability.troop) {
        localisationParams.name = this.$game.armyDB.getTemplate(
          ability.troop
        ).name;
      } else {
        if (ability.general) {
          localisationParams.name = this.$game.armyDB.getTemplate(
            ability.general
          ).name;
        }
      }

      return this.$t(ability.type, localisationParams);
    }
  }
};
</script>

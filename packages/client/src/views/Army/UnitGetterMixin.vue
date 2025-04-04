<script>
import UiConstants from "@/ui_constants";
import ArmyUnitTypes from "@/metadata/army_unit_types";
import RaidsMeta from "@/metadata/raids_meta";
import UnitAbilityType from "@/../../knightlands-shared/unit_ability_type";

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
    maxStars() {
      if (this.unit) {
        return this.$game.armyDB.getMaxStars(this.unit);
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
    maxPossibleLevel() {
      return this.maxLevel == this.nextMaxLevel;
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
    },
    isGeneral() {
      if (this.unit) {
        return !this.unit.troop;
      }

      return false;
    }
  },
  methods: {
    estimatedDamage() {
      if (this.unit) {
        return this.$game.army.estimateDamage(this.unit);
      }

      return 0;
    },
    getAbilityDesc(ability, overrideUnit) {
      const unit = this.unit || overrideUnit;
      const levelValue = this.$game.army.getAbilityLevelValue(unit, ability.id);

      const abilityTemplate = this.$game.armyDB.getAbility(
        ability.id,
        unit.troop
      );

      const localisationParams = { value: levelValue, ...ability };

      let locType = ability.type;

      switch (abilityTemplate.type) {
        case UnitAbilityType.ExtraTroopsDamage:
        case UnitAbilityType.ExtraGeneralsDamage:
        case UnitAbilityType.IncreasedTroopsDamagePerTroopTypeUsed:
        case UnitAbilityType.IncreasedTroopsDamage:
        case UnitAbilityType.IncreasedGeneralsDamage:
        case UnitAbilityType.ExtraTroopsDamagePerTroopType:
        case UnitAbilityType.IncreasedTroopsDamagePerGeneralOwned:
        case UnitAbilityType.IncreasedTroopsDamagePerGeneralTypeOwned:
          if (localisationParams.unitType == 0) {
            locType += "-all";
          }
          break;
      }

      if (ability.unitType) {
        localisationParams.unitType = this.$t(ArmyUnitTypes[ability.unitType]);
      }

      if (ability.unitType2) {
        localisationParams.unitType2 = this.$t(
          ArmyUnitTypes[ability.unitType2]
        );
      }

      if (ability.stars) {
        // create stars html
        localisationParams.stars = `<div class="flex flex-no-wrap flex-item-center"><div class="star active small"></div><span class="digit-font">${ability.stars}+</span></div>`;
      }

      if (ability.raid) {
        localisationParams.raid = this.$t(RaidsMeta[ability.raid].name);
      }

      if (ability.troop) {
        localisationParams.name = this.$t(
          this.$game.armyDB.getTemplate(ability.troop).name
        );
      } else {
        if (ability.general) {
          localisationParams.name = this.$t(
            this.$game.armyDB.getTemplate(ability.general).name
          );
        }
      }

      return this.$t(locType, localisationParams);
    }
  }
};
</script>

import armyAbilities from "@/army_abilities";
import armyUnits from "@/army_units";
import troopsMeta from "@/troops_meta";
import generalsMeta from "@/generals_meta";

export default class ArmyDB {
  constructor(itemsDB) {
    this._itemsDB = itemsDB;
  }

  getTemplates() {
    return armyUnits;
  }

  getTemplate(id) {
    if (typeof id == "object") {
      id = id.template;
    }

    return armyUnits[id];
  }

  getStars(unit) {
    return this.getTemplate(unit).stars + unit.promotions;
  }

  getIcon(unit) {
    const template = this.getTemplate(unit);
    return `/images/enemies/avatars/${template.icon}.png`;
  }

  getImage(unit) {
    const template = this.getTemplate(unit);
    return `/images/enemies/${template.icon}.png`;
  }

  getElement(unit) {
    const template = this.getTemplate(unit);
    return template.element;
  }

  getUnitType(unit) {
    const template = this.getTemplate(unit);
    return template.unitType;
  }

  getName(unit) {
    const template = this.getTemplate(unit);
    return template.name;
  }

  getWeaponType(unit) {
    const template = this.getTemplate(unit);
    return template.weaponType;
  }

  getAbility(id, troop) {
    const abilitiesRecords = troop
      ? armyAbilities.troops
      : armyAbilities.generals;
    return abilitiesRecords[id];
  }

  getAbilities(unit) {
    const abilities = [];
    const abilitiesRecords = unit.troop
      ? armyAbilities.troops
      : armyAbilities.generals;
    for (const abilityId of unit.abilities) {
      abilities.push(abilitiesRecords[abilityId]);
    }
    return abilities;
  }

  getMaxStars(unit) {
    return this.getTemplate(unit).stars <= 3 ? 3 : 10;
  }

  getMaxLevel(unit, next) {
    let meta = unit.troop ? troopsMeta.fusionMeta : generalsMeta.fusionMeta;
    let stars = this.getStars(unit) + (next ? 1 : 0);
    let record = meta.maxLevelByStars.find(x => x.stars == stars);
    if (record) {
      return record.maxLevel;
    }

    return meta.maxLevelByStars.find(x => x.stars == stars - 1).maxLevel;
  }
}

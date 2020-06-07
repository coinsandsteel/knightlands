import armyAbilities from "@/army_abilities";
import armyUnits from "@/army_units";
import troopsMeta from "@/troops_meta";
import generalsMeta from "@/generals_meta";
import AbilityResolver from "@/../knightlands-shared/ability_resolver";

export default class ArmyDB {
    constructor(statResolver) {
        this._abilityResolver = new AbilityResolver(armyAbilities, statResolver);
    }

    getTemplate(id) {
        if (typeof id == "object") {
            id = id.template;
        }

        return armyUnits[id];
    }

    getIcon(unit) {
        const template = this.getTemplate(unit);
        return `/images/enemies/${template.icon}.png`;
    }

    getElement(unit) {
        const template = this.getTemplate(unit);
        return template.element;
    }

    getStars(unit) {
        // stars are base stars + promotion level
        const template = this.getTemplate(unit);
        return template.stars + unit.promotions;
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

    getAbilityLevelValue(unit, abilityId) {
        return this._abilityResolver.getAbilityLevelValue(this.getStars(unit), abilityId, unit.troop);
    }

    getAbilities(unit) {
        const abilities = [];
        const abilitiesRecords = unit.troop ? armyAbilities.troops : armyAbilities.generals;
        for (const abilityId of unit.abilities) {
            abilities.push(abilitiesRecords[abilityId]);
        }
        return abilities;
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

    getDamage(unit, next) {
        let meta = unit.troop ? troopsMeta.leveling : generalsMeta.leveling;
        let level = unit.level;
        if (next) {
            level++;
        }
        return meta.levelingSteps[level - 1].power;
    }
}

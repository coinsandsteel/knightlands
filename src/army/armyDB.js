import armyAbilities from "@/army_abilities";
import generals from "@/generals";
import troops from "@/troops";
import AbilityResolver from "@/../knightlands-shared/ability_resolver";

export default class ArmyDB {
    constructor(statResolver) {
        this._abilityResolver = new AbilityResolver(armyAbilities, statResolver);
    }

    getTemplate(id, troop) {
        if (typeof id == "object") {
            troop = id.troop;
            id = id.template;
        }

        if (troop) {
            return troops[id];
        } else {
            return generals[id];
        }
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
        const abilitiesRecords = unit.troop ? armyAbilities.generals : armyAbilities.generals;
        for (const abilityId of unit.abilities) {
            abilities.push(abilitiesRecords[abilityId]);
        }
        return abilities;
    }
}

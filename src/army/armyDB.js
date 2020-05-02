import armyAbilities from "@/army_abilities";
import generals from "@/generals";
import troops from "@/troops";

export default class ArmyDB {
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
}

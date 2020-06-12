
import LegionResolver from "../../knightlands-shared/legion_resolver";
import ArmyMeta from "@/army_meta";
import Vue from "vue";
import throttle from "lodash.throttle";
import troopsMeta from "@/troops_meta";
import generalsMeta from "@/generals_meta";

const dummyUnit = {
    id: -1,
    template: -1,
    level: 1,
    _dummyValue: 0
};

export default class Army {
    constructor(game, armyDb) {
        this._game = game;
        this._legionResolver = new LegionResolver(
            armyDb.abilityResolver,
            troopsMeta,
            generalsMeta
        );
        this._armyDb = armyDb;
        this._vm = new Vue({
            data: () => ({
                units: {},
                legions: [],
                troops: [],
                generals: [],
                emptyUnit: dummyUnit
            })
        });
    }

    totalLegions() {
        return this._vm.legions.length;
    }

    getLegionDamage(legionIndex) {
        return this._legionResolver.getDamage(
            this.getLegion(legionIndex),
            this._vm.units,
            this._armyDb.getTemplates()
        )
    }

    getLegion(legionIndex) {
        if (legionIndex < 0 || legionIndex >= this._vm.legions.length) {
            return null;
        }
        return this._vm.legions[legionIndex];
    }

    filterUnits(troops, filters, buffer) {
        buffer = buffer || [];
        buffer.length = 0;

        const units = this.getUnits(troops);
        let i = 0; 
        const length = units.length;
        for (; i < length; ++i) {
            const unit = units[i];
            if (filters[this._armyDb.getStars(unit)]) {
                buffer.push(unit);
            }
        }

        return buffer;
    }

    getUnits(troops) {
        if (troops) {
            return this._vm.troops;
        }

        return this._vm.generals;
    }

    getUnit(id) {
        return this._vm.units[id];
    }

    getSlots(legionIndex, troops) {
        const legion = this.getLegion(legionIndex);
        if (!legion) {
            return [];
        }

        let slots = ArmyMeta.slots.filter(x => x.troop == troops);
        // collect unit in slot
        for (let i = 0; i < slots.length; ++i) {
            // get unit in legion
            slots[i].unit = this.getUnit(legion.units[slots[i].id]);
        }

        return slots;
    }

    setInSlot(legionIndex, slotId, unit) {
        const legion = this.getLegion(legionIndex);
        if (!unit) {
            this._vm.$delete(legion.units, slotId);
        } else {
            this._vm.$set(legion.units, slotId, unit.id);
        }
    }

    updateUnit(unit) {
        const currentUnit = this._vm.units[unit.id];
        if (!currentUnit) {
            this._vm.$set(this._vm.units, unit.id, unit);
        } else {
            for(const prop in unit) {
                this._vm.$set(currentUnit, prop, unit[prop]);
            }
        }
    }

    async load() {
        if (this._loaded) {
            return false;
        }

        let army = await this._game.getArmy();
        this._loaded = true;

        const unitsDict = {};
        let i = 0;
        const length = army.units.length;
        for (; i < length; ++i) {
            const unit = army.units[i];
            unitsDict[unit.id] = unit;

            if (unit.troop) {
                this._vm.troops.push(unit);
            } else {
                this._vm.generals.push(unit);
            }
        }

        this._vm.units = unitsDict;
        this._vm.legions = army.legions || {};

        return true;
    }
}

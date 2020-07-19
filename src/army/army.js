
import ArmyMeta from "@/army_meta";
import Vue from "vue";
import throttle from "lodash.throttle";
import ArmyAbilities from "@/army_abilities";
import ArmyResolver from "@/../knightlands-shared/army_resolver";
import armyUnits from "@/army_units";
import TroopsMeta from "@/troops_meta";
import GeneralsMeta from "@/generals_meta";

const dummyUnit = {
    id: -1,
    template: -1,
    level: 1,
    _dummyValue: 0
};

export default class Army {
    constructor(game, itemsResolver, armyDb) {
        this._game = game;
        this._armyDb = armyDb;
        this._armyResolver = new ArmyResolver(ArmyAbilities, itemsResolver, armyUnits, TroopsMeta, GeneralsMeta);
        this._unitsIndex = this._armyResolver.buildUnitsIndex({});
        this._vm = new Vue({
            data: () => ({
                units: {},
                legions: [],
                troops: [],
                generals: [],
                emptyUnit: dummyUnit
            })
        });
        this._sort = throttle(this._doSort.bind(this), 0, { leading: false });
    }

    totalLegions() {
        return this._vm.legions.length;
    }

    getStars(unit) {
        return this._armyResolver.getStars(unit);
    }

    estimateDamage(unit) {
        return this._armyResolver.estimateDamage(unit, this._unitsIndex).unitsDamageOutput[unit.id];
    }

    getDamage(params) {
        return this._armyResolver.getDamage(...params);
    }

    getAbilityLevelValue(unit, abilityId) {
        return this._armyResolver.getAbilityLevelValue(unit, abilityId);
    }

    getLegionDamage(legionIndex) {
        const legion = this.getLegion(legionIndex);
        const units = {};
        for (let slotId in legion.units) {
            const unitId = legion.units[slotId];
            units[unitId] = this.getUnit(unitId);
        }
        return this._armyResolver.estimateDamageOutput(units, this._unitsIndex);
    }

    filterIngridientUnits(referenceUnit, ingridient, selectedUnits) {
        let buffer = [];
        buffer.length = 0;

        const units = this.getUnits(referenceUnit.troop);
        const refElement = this._armyDb.getElement(referenceUnit);
        let i = 0;
        const length = units.length;
        for (; i < length; ++i) {
            const unit = units[i];
            if (selectedUnits[unit.id]) {
                continue;
            }

            if (unit == referenceUnit) {
                continue;
            }

            if (ingridient.copy) {
                if (unit.template != referenceUnit.template) {
                    continue;
                }
            }

            if (ingridient.stars) {
                if (this.getStars(unit) != ingridient.stars) {
                    continue;
                }
            }

            if (ingridient.sameElement) {
                if (this._armyDb.getElement(unit) != refElement) {
                    continue;
                }
            }

            buffer.push(unit);
        }

        return buffer;
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
            if (filters[this.getStars(unit)]) {
                buffer.push(unit);
            }
        }

        return buffer;
    }

    getUnitsWithFilter(troops, filterFn) {
        const units = this.getUnits(troops);
        const filteredUnits = new Array(units.length);
        let index = 0;
        const length = units.length;
        let i = 0;
        for (; i < length; ++i) {
            if (filterFn(units[i])) {
                filteredUnits[index++] = units[i];
            }
        }
        filteredUnits.length = index;
        return filteredUnits;
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
            for (const prop in unit) {
                this._vm.$set(currentUnit, prop, unit[prop]);
            }
        }
        this._sort(unit.troop);
    }

    addUnits(units) {
        for (const unit of units) {
            if (unit.troop) {
                unit.idx = this._vm.troops.push(unit) - 1;
            } else {
                unit.idx = this._vm.generals.push(unit) - 1;
            }
            this._vm.$set(this._vm.units, unit.id, unit);
        }

        this._doSort(true);
        this._doSort(false);
    }

    removeUnits(ids) {
        for (const id of ids) {
            const unit = this._vm.units[id];
            if (!unit) {
                continue;
            }
            
            let units = this._vm.generals;
            if (unit.troop) {
                units = this._vm.troops;
            }
            this._vm.$delete(this._vm.units, id);

            const lastUnit = units[units.length - 1];
            units[unit.idx] = lastUnit;
            lastUnit.idx = unit.idx;
            units.splice(unit.idx, 1);
        }

        this._doSort(true);
        this._doSort(false);
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
                unit.idx = this._vm.troops.push(unit) - 1;
            } else {
                unit.idx = this._vm.generals.push(unit) - 1;
            }
        }

        this._vm.units = unitsDict;
        this._vm.legions = army.legions || {};

        this._unitsIndex.update(unitsDict);

        this._doSort(true);
        this._doSort(false);

        return true;
    }

    _doSort(troops) {
        const units = troops ? this._vm.troops : this._vm.generals;
        units.sort((x, y) => {
            let diff = this.getStars(y) - this.getStars(x);
            if (diff === 0) {
                return y.template - x.template;
            }
            return diff;
        });

        let i = 0;
        const l = units.length;
        for (; i < l; ++i) {
            units[i].idx = i;
        }
    }
}

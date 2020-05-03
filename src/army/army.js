
import ArmyMock from "./ArmyMock";
import ArmyMeta from "@/army_meta";
import Vue from "vue";
import throttle from "lodash.throttle";

const dummyUnit = {
    id: -1,
    template: -1,
    level: 1,
    _dummyValue: 0
};

export default class Army {
    constructor(armyDb) {
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

    getLegion(legionIndex) {
        if (legionIndex < 0 || legionIndex >= this._vm.legions.length) {
            return null;
        }
        return this._vm.legions[legionIndex];
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
            slots[i].unit = this.getUnit(legion.units[i]);
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

    async load() {
        if (this._loaded) {
            return;
        }

        this._loaded = true;

        this._vm.units = ArmyMock.units;

        this._vm.legions = ArmyMock.legions;

        for (const unit of Object.values(this._vm.units)) {
            if (unit.troop) {
                this._vm.troops.push(unit);
            } else {
                this._vm.generals.push(unit);
            }
        }
    }
}


import ArmyMock from "./ArmyMock";
import ArmyMeta from "@/army_meta";

export default class Army {
    constructor(armyDb) {
        this._armyDb = armyDb;
    }

    getLegion(legionIndex) {
        if (legionIndex < 0 || legionIndex >= this.legions.length) {
            return null;
        }
        return this.legions[legionIndex];
    }

    getUnits(troops) {
        if (troops) {
            return this.troops;
        }

        return this.generals;
    }

    getUnit(id) {
        return this._units[id];
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

    async load() {
        if (this._loaded) {
            return;
        }

        this._loaded = true;

        this._units = ArmyMock.units;

        this.legions = ArmyMock.legions;
        this.troops = [];
        this.generals = [];

        for (const unit of Object.values(this._units)) {
            if (unit.troop) {
                this.troops.push(unit);
            } else {
                this.generals.push(unit);
            }
        }
    }
}

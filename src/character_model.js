import Vue from "vue";

import CharacterStats from "../knightlands-shared/character_stat.js";

class CharacterModel {
    constructor(socket, game) {
        this._socket = socket;
        this._game = game;

        let stats = {};
        stats[CharacterStats.Attack] = 0;
        stats[CharacterStats.Defense] = 0;
        stats[CharacterStats.Health] = 0;
        stats[CharacterStats.Energy] = 0;
        stats[CharacterStats.Stamina] = 0;
        stats[CharacterStats.Luck] = 0;
        stats[CharacterStats.CriticalChance] = 0;

        let timers = {};
        timers[CharacterStats.Health] = {
            value: 0,
            lastRegenTime: 0,
            regenTime: 10
        };
        timers[CharacterStats.Energy] = {
            value: 0,
            lastRegenTime: 0,
            regenTime: 10
        };
        timers[CharacterStats.Stamina] = {
            value: 0,
            lastRegenTime: 0,
            regenTime: 10
        };

        this._vm = new Vue({
            data: () => ({
                equipment: {},
                timers: timers, // timers for health, energy, stamina etc.
                stats: Object.assign({}, stats), // final stats
                attributes: Object.assign({}, stats), //upgradable stats
                freeAttributePoints: 0,
                level: 1,
                exp: 0
            })
        });
    }

    get alive() {
        return this._vm.timers[CharacterStats.Health].value >= 1;
    }

    get equipment() {
        return this._vm.equipment;
    }

    get maxStats() {
        return this._vm.stats;
    }

    get timers() {
        return this._vm.timers;
    }

    get attributes() {
        return this._vm.attributes;
    }

    get level() {
        return this._vm.level;
    }

    get exp() {
        return this._vm.exp;
    }

    set exp(value) {
        this._vm.exp = value;
    }

    assignData(data) {
        let attributes = this.attributes;
        for (let i in data.attributes) {
            attributes[i] = data.attributes[i];
        }

        let maxStats = this.maxStats;
        for (let i in data.stats) {
            maxStats[i] = data.stats[i];
        }

        for (let i in data.timers) {
            this.setTimer(i, data.timers[i]);
        }

        for (let slot in data.equipment) {
            this._vm.$set(this._vm.equipment, slot, data.equipment[slot]);
        }

        this._vm.level = data.level;
        this._vm.exp = data.exp;
        this._vm.freeAttributePoints = data.freeAttributePoints;
    }

    refillTimer(stat) {
        this.timers[stat].value = this.maxStats[stat];
        clearTimeout(this.timers[stat].timeout);
    }

    mergeData(data) {
        this._mergeData(this._vm.$data, data);
    }

    removeData(data) {
        if (!data) {
            return;
        }

        if (data.equipment) {
            this._removeData(this._vm.equipment, data.equipment, true);
        }
    }

    _removeData(currentData, dataToRemove, root) {
        for (let i in currentData) {
            if (dataToRemove.hasOwnProperty(i)) {
                if (typeof dataToRemove[i] == "object") {
                    this._removeData(currentData[i], dataToRemove[i], false);
                } else {
                    this._vm.$delete(currentData, i);
                }
            } 
        }
    }

    _mergeData(currentData, newData) {
        for (let i in newData) {
            if (typeof (newData[i]) == "object") {
                if (currentData.hasOwnProperty(i)) {
                    this._mergeData(currentData[i], newData[i]);
                } else {
                    this._vm.$set(currentData, i, newData[i]);
                }
            } else if (!currentData.hasOwnProperty(i)) {
                this._vm.$set(currentData, i, newData[i]);
            } else if (currentData[i] !== newData[i]) {
                currentData[i] = newData[i];
            }
        }
    }

    equipItem(item) {
        this._vm.equipment[item.type] = item;
    }

    getStat(stat) {
        return this._vm.stats[stat] || 0;
    }

    getAttribute(att) {
        return this.attributes[att];
    }

    modifyAttribute(att, value) {
        this.attributes[att] += value;
    }

    resetAttributes() {
        for (let i in this._data.attributes) {
            this._vm.freeAttributePoints += this._vm.attributes[i];
            this._vm.attributes[i] = 0;
        }
    }

    setTimer(stat, timer) {
        this.timers[stat].value = timer.value;
        this.timers[stat].lastRegenTime = timer.lastRegenTime;
        this.timers[stat].regenTime = timer.regenTime;

        this._setTimerInterval(stat, this.timers[stat].regenTime - (this._game.now/1000 - this.timers[stat].lastRegenTime));
    }

    _setTimerInterval(stat, interval) {
        interval *= 1000;

        if (this.timers[stat].value >= this.maxStats[stat]) {
            // console.log(`timer ${stat} has reached maximum value ${this.maxStats[stat]}`);
            return;
        }

        clearTimeout(this.timers[stat].timeout);
        
        console.log(`timer ${stat} value ${this.timers[stat].value} interval ${interval}`);
        this.timers[stat].timeout = setTimeout(() => {
            let now = Math.floor(this._game.now / 1000);
            let pointsRegened  = Math.round((now - this.timers[stat].lastRegenTime) / this.timers[stat].regenTime);
            this.timers[stat].value += pointsRegened;
            this.timers[stat].lastRegenTime = now;
            console.log(`timer ${stat} has fired! New value ${this.timers[stat].value}`);
            this._setTimerInterval(stat, this.timers[stat].regenTime);
        }, interval);
    }
}

export default CharacterModel;
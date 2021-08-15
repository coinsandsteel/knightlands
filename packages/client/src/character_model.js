import Vue from "vue";

import CharacterStats, {
  DefaultStats
} from "@/../../knightlands-shared/character_stat.js";
import Buffs from "@/../../knightlands-shared/buffs";

class CharacterModel {
  constructor(socket, game) {
    this._socket = socket;
    this._game = game;

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
        class: "",
        equipment: {},
        timers: timers, // timers for health, energy, stamina etc.
        stats: Object.assign({}, DefaultStats), // final stats
        attributes: Object.assign({}, DefaultStats), //upgradable stats
        freeAttributePoints: 0,
        level: 1,
        exp: 0,
        buffResolver: null,
        buffs: [],
        nickname: null,
        avatar: 0
      })
    });

    this._vm.buffResolver = new Buffs();
  }

  get buffResolver() {
    return this._vm.buffResolver;
  }

  get class() {
    return this._vm.class;
  }

  get buffs() {
    return this._vm.buffs;
  }

  getTimer(stat) {
    return this._vm.timers[stat];
  }

  get alive() {
    return this._vm.timers[CharacterStats.Health].value >= 1;
  }

  get nickname() {
    return this._vm.nickname;
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

  get avatar() {
    return this._vm.avatar;
  }

  set avatar(v) {
    this._vm.avatar = v;
  }

  getMaxStat(stat) {
    return this._vm.stats[stat];
  }

  applyBuff(buff) {
    const currentBuff = this._vm.buffs.find(x => x.template == buff.template);
    if (currentBuff) {
      currentBuff.applyTime = buff.applyTime;
    } else {
      this._vm.buffs.push(buff);
      this._sortBuffs();
    }
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
    this._vm.nickname = data.nickname;
    this._vm.class = data.class;
    this._vm.exp = data.exp;
    this._vm.avatar = data.avatar || 0;
    this._vm.freeAttributePoints = data.freeAttributePoints;

    this._vm.buffs = data.buffs;

    this._sortBuffs();
    this._calculateBuffs();
  }

  _sortBuffs() {
    this._vm.buffs.sort((a, b) => {
      const sortingFactorA = a.template;
      const sortingFactorB = b.template;

      if (sortingFactorA > sortingFactorB) {
        return -1;
      }

      if (sortingFactorA < sortingFactorB) {
        return 1;
      }

      return 0;
    });
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
      this._removeData(this._vm.equipment, data.equipment, false);
    }
  }

  _calculateBuffs() {
    this.buffResolver.calculateBonuses(
      this._game.now,
      this._vm.stats,
      this._vm.buffs
    );

    const baseDefense = 10 * this._vm.level;
    let damageReduction =
      this._vm.stats[CharacterStats.Defense] /
      (this._vm.stats[CharacterStats.Defense] + baseDefense);
    this._vm.stats[CharacterStats.DamageReduction] =
      Math.floor(damageReduction * 10000) / 100;
  }

  _removeData(currentData, dataToRemove, root) {
    for (let i in currentData) {
      if (dataToRemove.hasOwnProperty(i)) {
        if (typeof dataToRemove[i] == "object") {
          this._removeData(currentData[i], dataToRemove[i], false);
        } else if (!root) {
          this._vm.$delete(currentData, i);
        }
      }
    }
  }

  _mergeData(currentData, newData, root = true) {
    // console.log(currentData, newData);
    for (let i in newData) {
      const newField = newData[i];

      if (Array.isArray(newData[i])) {
        currentData[i] = newData[i];
        continue;
      }

      if (typeof newField == "object") {
        if (currentData.hasOwnProperty(i)) {
          this._mergeData(currentData[i], newField, false);
        } else if (!root) {
          this._vm.$set(currentData, i, newField);
        }
      } else if (!root && !currentData.hasOwnProperty(i)) {
        this._vm.$set(currentData, i, newField);
      } else if (currentData[i] !== newField) {
        currentData[i] = newField;
      }
    }

    this._calculateBuffs();

    for (let stat in this.timers) {
      this._scheduleTimer(stat);
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
    this._scheduleTimer(stat);
  }

  _scheduleTimer(stat) {
    this._setTimerInterval(
      stat,
      this.timers[stat].regenTime -
        (this._game.now / 1000 - this.timers[stat].lastRegenTime)
    );
  }

  _setTimerInterval(stat, interval) {
    interval *= 1000;

    if (this.timers[stat].value >= this.maxStats[stat]) {
      // console.log(`timer ${stat} has reached maximum value ${this.maxStats[stat]}`);
      return;
    }

    clearTimeout(this.timers[stat].timeout);

    // console.log(`timer ${stat} value ${this.timers[stat].value} interval ${interval}`);
    this.timers[stat].timeout = setTimeout(() => {
      let now = Math.floor(this._game.now / 1000);
      let pointsRegened =
        (now - this.timers[stat].lastRegenTime) / this.timers[stat].regenTime;
      this.timers[stat].value += pointsRegened;
      this.timers[stat].value = Math.round(this.timers[stat].value);
      this.timers[stat].lastRegenTime = now;
      // console.log(`timer ${stat} has fired! New value ${this.timers[stat].value}`);
      this._scheduleTimer(stat);
    }, interval);
  }
}

export default CharacterModel;

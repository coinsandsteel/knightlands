/*jshint esversion: 9 */

import ArmyMeta from "@/army_meta";
import Vue from "vue";
import throttle from "lodash.throttle";
import ArmyAbilities from "@/army_abilities";
import ArmyResolver from "@/../../knightlands-shared/army_resolver";
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
  constructor(game, itemsResolver, armyDb, inventory, character) {
    this._inventory = inventory;
    this._character = character;
    this._game = game;
    this._armyDb = armyDb;
    this._armyResolver = new ArmyResolver(
      ArmyAbilities,
      itemsResolver,
      armyUnits,
      TroopsMeta,
      GeneralsMeta,
      {
        level: ArmyMeta.damageBonusPerLevel,
        rarity: ArmyMeta.damageBonusPerRarity,
        enchant: ArmyMeta.damageBonusPerEnchantLevel
      }
    );
    this._unitsIndex = this._armyResolver.buildUnitsIndex({}, {});
    this._vm = new Vue({
      data: () => ({
        reserve: {},
        units: {},
        reserveUnits: [],
        legions: [],
        troops: [],
        generals: [],
        emptyUnit: dummyUnit,
        tempSlots: {},
        freeSlots: 0,
        maxSlots: 0
      })
    });
    this._sort = throttle(this._doSort.bind(this), 0, { leading: false });
  }

  get currentSlots() {
    return this._vm.troops.length + this._vm.generals.length;
  }

  get maxSlots() {
    return this._vm.maxSlots;
  }

  resetTempSlots() {
    this._vm.tempSlots = {};
    return this.tempSlots;
  }

  setTempSlot(slotId, unit) {
    this._vm.$set(this._vm.tempSlots, slotId, unit);
  }

  get tempSlots() {
    return this._vm.tempSlots;
  }

  totalLegions() {
    return this._vm.legions.length;
  }

  getStars(unit) {
    return this._armyResolver.getStars(unit);
  }

  estimateDamage(unit) {
    if (!unit) {
      return 0;
    }

    const units = {};
    const legion = this.getLegion(unit.legion);
    if (legion) {
      for (let slotId in legion.units) {
        const unitId = legion.units[slotId];

        const unit = this.getUnit(unitId);
        if (!unit) {
          continue;
        }
        units[unitId] = unit;
      }
    }

    units[unit.id] = unit;

    this._updateUnitEquipment(unit);
    const result = this._armyResolver.estimateDamage(
      units,
      this._unitsIndex,
      this._character.maxStats
    );
    return result.unitsDamageOutput[unit.id];
  }

  getDamage(unit, nextLevel, nextStar) {
    if (!unit) {
      return 0;
    }

    this._updateUnitEquipment(unit);
    return this._armyResolver.getDamage(unit, nextLevel, nextStar, 0);
  }

  getAbilityLevelValue(unit, abilityId) {
    return this._armyResolver.getAbilityLevelValue(unit, abilityId);
  }

  getLegionDamage(legionIndex, playerStats) {
    const legion = this.getLegion(legionIndex);
    const units = {};
    for (let slotId in legion.units) {
      const unitId = legion.units[slotId];

      const unit = this.getUnit(unitId);
      if (!unit) {
        continue;
      }
      units[unitId] = unit;
      this._updateUnitEquipment(units[unitId]);
    }

    return this._armyResolver.resolve({
      units,
      unitsIndex: this._unitsIndex,
      userStats: playerStats
    });
  }

  _updateUnitEquipment(unit) {
    // refresh unit's equipment
    for (let slotId in unit.items) {
      const item = unit.items[slotId];
      if (item) {
        const invItem = this._inventory.getItem(item.id);
        if (invItem) {
          unit.items[slotId] = invItem;
        }
      }
    }
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

  _testFilter(unit, filter) {
    if (!filter.star[this.getStars(unit)]) {
      return false;
    }

    if (!filter.type[this._armyDb.getUnitType(unit)]) {
      return false;
    }

    if (unit.troop) {
      if (!filter.element[this._armyDb.getElement(unit)]) {
        return false;
      }

      if (!filter.weapon[this._armyDb.getWeaponType(unit)]) {
        return false;
      }
    }

    return true;
  }

  filterProvidedUnits(units, filters, buffer, toInsert) {
    buffer = buffer || [];
    buffer.length = 0;

    if (toInsert) {
      if (!this._testFilter(toInsert, filters)) {
        buffer.push(toInsert);
      }
    }

    let i = 0;
    const length = units.length;
    for (; i < length; ++i) {
      const unit = units[i];
      if (this._testFilter(unit, filters)) {
        buffer.push(unit);
      }
    }

    return buffer;
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

  getReserve() {
    return this._vm.reserveUnits;
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
      this.addUnits([unit]);
    } else {
      for (const prop in unit) {
        this._vm.$set(currentUnit, prop, unit[prop]);
      }
    }
  }

  updateMaxSlots(newMaxSlots) {
    this._vm.maxSlots = newMaxSlots.maxSlots;
  }

  updateReserve(newReserve) {
    let added = false;
    for (const key in newReserve) {
      const newUnit = newReserve[key];
      if (!this._vm.reserve[key]) {
        newUnit.index = this._vm.reserveUnits.push(newUnit) - 1;
        added = true;
        this._vm.$set(this._vm.reserve, key, newUnit);
      } else {
        this._vm.$set(this._vm.reserve[key], "count", newUnit.count);
      }
    }
    this._sort(this._vm.reserveUnits);

    this._unitsIndex.update(null, this._vm.reserve);
  }

  addUnits(units) {
    let addTroop = false;
    let addGeneral = false;
    for (const unit of units) {
      if (unit.troop) {
        unit.idx = this._vm.troops.push(unit) - 1;
        addTroop = true;
      } else {
        unit.idx = this._vm.generals.push(unit) - 1;
        addGeneral = true;
      }
      this._vm.$set(this._vm.units, unit.id, unit);
    }

    this._unitsIndex.update(this._vm.units, null);
    if (addGeneral) {
      this._doSort(this._vm.generals);
    }

    if (addTroop) {
      this._doSort(this._vm.troops);
    }
  }

  removeUnits(ids) {
    const removed = {};
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
      this._vm.$set(units, unit.idx, lastUnit);
      lastUnit.idx = unit.idx;
      removed[unit.id] = unit;
      units.splice(units.length - 1);
    }

    this._unitsIndex.update(this._vm.units, null);
    this._doSort(this._vm.generals);
    this._doSort(this._vm.troops);
  }

  loadFromData(armyData, preview = false) {
    const unitsDict = {};

    this._vm.troops = [];
    this._vm.generals = [];

    if (armyData) {
      this._vm.legions = armyData.legions;
      this._vm.maxSlots = armyData.maxSlots;

      let i = 0;
      const length = armyData.units.length;
      for (; i < length; ++i) {
        const unit = armyData.units[i];
        unitsDict[unit.id] = unit;

        if (unit.troop) {
          unit.idx = this._vm.troops.push(unit) - 1;
        } else {
          unit.idx = this._vm.generals.push(unit) - 1;
        }
      }

      this._vm.reserve = armyData.reserve || this._vm.reserve;
      for (let i in this._vm.reserve) {
        this._vm.reserveUnits.push(this._vm.reserve[i]);
      }
    } else {
      this._loaded = false;
    }

    this._vm.units = unitsDict;

    if (!preview) {
      this._unitsIndex.update(unitsDict, this._vm.reserve);
      this._doSort(this._vm.reserveUnits);
      this._doSort(this._vm.generals);
      this._doSort(this._vm.troops);
    }
  }

  async load() {
    if (this._loaded) {
      return this._loaded;
    }

    this._loaded = true;

    this._loadingRequest = this._game.getArmy().catch(() => {
      this._loaded = false;
      this._loadingRequest = null;
    });

    let army = await this._loadingRequest;
    this._loadingRequest = null;

    this.loadFromData(army);

    return true;
  }

  _doSort(units) {
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

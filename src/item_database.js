'use strict';

const ItemTemplates = require("./items.json");
const {
  getSlot
} = require("@/../knightlands-shared/equipment_slot");

const ItemType = require("@/../knightlands-shared/item_type");

const Meta = require("./meta.json");

const ItemExpTable = require("./expTables.json");

import ItemStatResolver from "@/../knightlands-shared/item_stat_resolver";

class ItemDatabase {
  constructor() {
    this._itemStatResolver = new ItemStatResolver(Meta.statConversions, Meta.itemPower);
  }

  getName(id) {
    return ItemTemplates[id].caption;
  }

  getIcon(id) {
    let template = ItemTemplates[id];
    if (template.type == ItemType.Equipment) {
      return (
        `/images/items/${template.type}/${getSlot(template.equipmentType)}/${template.icon}.png`
      );
    }

    return (
      `/images/items/${template.type}/${template.icon}.png`
    );
  }

  getRarity(id) {
    return ItemTemplates[id].rarity;
  }

  getItemType(id) {
    return ItemTemplates[id].type;
  }

  getRarity(id) {
    return ItemTemplates[id].rarity;
  }

  getEquipmentType(id) {
    return ItemTemplates[id].equipmentType;
  }

  getTemplate(id) {
    return ItemTemplates[id];
  }

  getSlot(id) {
    return getSlot(ItemTemplates[id].equipmentType);
  }

  getMaxLevel(item) {
    return Meta.itemLimitBreaks[item.breakLimit];
  }

  getNextExp(level) {
    return ItemExpTable[level - 1];
  }

  getStats(item) {
    let template = this.getTemplate(item.template);
    return this._itemStatResolver.convertStats(template, item.level);
  }
}

export default ItemDatabase;
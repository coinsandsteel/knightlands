'use strict';

const ItemTemplates = require("./items.json");
const {
  getSlot
} = require("@/../knightlands-shared/equipment_slot");

const ItemType = require("@/../knightlands-shared/item_type");

const Meta = require("./meta.json");

const Properties = require("./item_properties.json");

const UpgradeMeta = require("./upgrade_meta.json");

import ItemStatResolver from "@/../knightlands-shared/item_stat_resolver";

class ItemDatabase {
  constructor() {
    this._itemStatResolver = new ItemStatResolver(Meta.statConversions, Meta.itemPower, Meta.itemPowerSlotFactors);
  }

  getName(id) {
    if (typeof id == "object") {
      id = id.template;
    }

    return ItemTemplates[id].caption;
  }

  getIcon(id) {
    let template = ItemTemplates[id];
    if (template.type == ItemType.Equipment) {
      return (
        `/images/items/${template.type}/${template.equipmentType}/${template.icon}.png`
      );
    }

    return (
      `/images/items/${template.type}/${template.icon}.png`
    );
  }

  getProperty(propId) {
    return Properties[propId];
  }

  getRarityAsNumber(id) {
    switch (this.getRarity(id)) {
      case "common":
        return 0;
      case "rare":
        return 1;
      case "epic":
        return 2;
      case "legendary":
        return 3;
      case "mythical":
        return 4;
    }

    return 0;
  }

  getItemType(id) {
    return ItemTemplates[id].type;
  }

  getRarity(item) {
    if (typeof item == "number") {
      if (!ItemTemplates[item]) {
        console.log("no item", item);
      }
      return ItemTemplates[item].rarity;
    }
    return ItemTemplates[item.template].rarity;
  }

  getEquipmentType(id) {
    return ItemTemplates[id].equipmentType;
  }

  getTemplate(item) {
    if (typeof item == "number") {
      return ItemTemplates[item];
    }

    return ItemTemplates[item.template];
  }

  getSlot(id) {
    let template = ItemTemplates[id];
    if (template.type != ItemType.Equipment) return null;
    return getSlot(template.equipmentType);
  }

  getMaxLevel(item, unbindLevel) {
    unbindLevel = unbindLevel || item.breakLimit;
    return Meta.itemLimitBreaks[this.getRarity(item)][unbindLevel];
  }

  getNextExp(level) {
    return UpgradeMeta.levelExpTable[level - 1];
  }

  getMaterialExp(item, material) {
    let expPerMaterial = 0;
    let meta = this.getUpgradeMeta(item);
    let materialTemplate = ItemTemplates[material.template];

    if (materialTemplate.type == ItemType.Equipment) {
      let materialSlot = this.getSlot(material.template);
      expPerMaterial = UpgradeMeta.rarityExpFactor.find(x=>x.rarity==materialTemplate.rarity).exp;
      expPerMaterial *= UpgradeMeta.slotExpFactor.find(x=>x.slot==materialSlot).expFactor;
      expPerMaterial *= UpgradeMeta.levelExpFactor[material.level - 1];
    } else {
      let materialExp = meta.experienceMaterials.find(x => x.itemId == material.template);
      if (materialExp) {
          expPerMaterial = materialExp.experience;
      }
    }

    return expPerMaterial;
  }

  getUpgradableSlots() {
    let slots = {};
    let levelingMeta = UpgradeMeta.levelingMeta;
    let i = 0;
    const length = levelingMeta.length;
    for (; i < length; ++i) {
      levelingMeta[i].slots.forEach(slot=>slots[slot]=true);
    }

    return slots;
  }

  getUpgradeMeta(item) {
    let slot = this.getSlot(item.template);

    let levelingMeta = UpgradeMeta.levelingMeta;
    let i = 0;
    const length = levelingMeta.length;
    for (; i < length; ++i) {
      let meta = levelingMeta[i];
      if (!meta.slots.includes(slot)) {
        continue;
      }

      return meta;
    }

    return null
  }

  getStats(item, forceLevel) {
    let template;
    let level = 1;
    if (typeof item == "number") {
      template = this.getTemplate(item);
    } else {
      template = this.getTemplate(item.template);
      level = item.level || 1;
    }

    if (forceLevel) {
      level = forceLevel;
    }

    return this._itemStatResolver.convertStats(template, level);
  }
}

export default ItemDatabase;
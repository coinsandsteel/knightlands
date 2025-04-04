/*jshint esversion: 9 */

"use strict";

const ItemTemplates = require("./metadata/items.json");
const {
  getSlot,
  EquipmentSlots
} = require("@/../../knightlands-shared/equipment_slot");
const ItemType = require("@/../../knightlands-shared/item_type");
const Meta = require("./metadata/meta.json");
const Properties = require("./metadata/item_properties.json");
const UpgradeMeta = require("./metadata/upgrade_meta.json");
const EnchantingMeta = require("./metadata/enchanting_meta.json");
import ItemStatResolver from "@/../../knightlands-shared/item_stat_resolver";
import EvolveData from "@/metadata/evolve";

class ItemDatabase {
  constructor() {
    this._itemStatResolver = new ItemStatResolver(
      Meta.statConversions,
      Meta.itemPower,
      Meta.itemPowerSlotFactors,
      Meta.charmItemPower
    );
  }

  get itemStatResolver() {
    return this._itemStatResolver;
  }

  getPower(stats) {
    return this._itemStatResolver.inverseStats(stats);
  }

  getName(id) {
    if (typeof id == "object") {
      id = id.template;
    }

    return ItemTemplates[id].caption;
  }

  getMaxEnchantingLevel() {
    return EnchantingMeta.maxEnchanting;
  }

  getIcon(id, rarity) {
    let template = this.getTemplate(id);
    // if (template.type == ItemType.Equipment) {
    //   return `/images/items/${template.type}/${template.equipmentType}/${template.icon}.png`;
    // }

    // // return `/images/items/${template.type}/${template.icon}.png`;
    // if (template.type == ItemType.Equipment && rarity) {
    //   if (ItemIcons[id]) {
    //     const item = ItemIcons[id][rarity];
    //     if (item) {
    //       return this.getIcon(item);
    //     }
    //   }
    // }

    return `${template.icon}`;
  }

  getEvolvedTemplate(id) {
    let template = this.getTemplate(id);
    return EvolveData.templates[template.id];
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
    return this.getTemplate(id).type;
  }

  getElement(item) {
    if (item.element) {
      return item.element;
    }

    return this.getTemplate(item).element;
  }

  getRarity(item) {
    let templateid = item;
    if (typeof item == "object") {
      if (item.rarity) {
        return item.rarity;
      }

      templateid = item.template;
    }

    if (!ItemTemplates[templateid]) {
      console.error("no item", item);
    }

    return ItemTemplates[templateid].rarity;
  }

  isWeapon(id) {
    const slot = this.getSlot(id);
    return slot == EquipmentSlots.MainHand || slot == EquipmentSlots.OffHand;
  }

  isAccessory(id) {
    const slot = this.getSlot(id);
    return slot == EquipmentSlots.Ring || slot == EquipmentSlots.Necklace;
  }

  isArmour(id) {
    const slot = this.getSlot(id);
    return (
      slot == EquipmentSlots.Boots ||
      slot == EquipmentSlots.Cape ||
      slot == EquipmentSlots.Chest ||
      slot == EquipmentSlots.Gloves ||
      slot == EquipmentSlots.Helmet
    );
  }

  isEquipment(id) {
    return this.getItemType(id) == ItemType.Equipment;
  }

  getEquipmentType(id) {
    return this.getTemplate(id).equipmentType;
  }

  getTemplate(item) {
    if (typeof item == "number") {
      return ItemTemplates[item];
    }

    return ItemTemplates[item.template];
  }

  getSlot(id) {
    let template = this.getTemplate(id);
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
    const meta = this.getUpgradeMeta(item);
    const materialTemplate = ItemTemplates[material.template];

    if (materialTemplate.type == ItemType.Equipment) {
      let materialSlot = this.getSlot(material.template);
      expPerMaterial = UpgradeMeta.rarityExpFactor.find(
        x => x.rarity == materialTemplate.rarity
      ).exp;
      expPerMaterial *= UpgradeMeta.slotExpFactor.find(
        x => x.slot == materialSlot
      ).expFactor;
      expPerMaterial *= UpgradeMeta.levelExpFactor[material.level - 1];
    } else {
      let materialExp = meta.experienceMaterials.find(
        x => x.itemId == material.template
      );
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
      levelingMeta[i].slots.forEach(slot => (slots[slot] = true));
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

    return null;
  }

  getStats(item, forceLevel, forceEnchanting, forceRarity) {
    let template;
    let level = 1;
    let enchantingLevel = 0;

    if (typeof item == "number") {
      template = this.getTemplate(item);
    } else {
      template = this.getTemplate(item.template);
      level = item.level || 1;
      enchantingLevel = item.enchant || 0;
    }

    if (forceLevel) {
      level = forceLevel;
    }

    if (forceEnchanting) {
      enchantingLevel = forceEnchanting;
    }

    return this._itemStatResolver.convertStats(
      template,
      level,
      enchantingLevel,
      forceRarity
    );
  }
}

export default ItemDatabase;

import Vue from "vue";
import throttle from "lodash.throttle";
import ItemType from "@/../knightlands-shared/item_type";
const ItemActions = require("@/../knightlands-shared/item_actions");

const dummyItem = {
    id: -1,
    template: -1,
    count: 0,
    level: 1,
    exp: 0,
    equipped: false,
    breakLimit: 0,
    unique: false,
    _dummyValue: 0
};

class Inventory {
    constructor(itemDB) {
        this._itemDB = itemDB;
        this._vm = new Vue({
            data: () => ({
                items: [],
                currencies: {},
                emptyItem: dummyItem
            })
        });

        // lookup tables
        this._itemsBytemplate = new Map();
        this._itemsById = new Map();
        this._sort = throttle(this._doSort.bind(this), 0, { leading: false });
    }

    static get Changed() {
        return "changed";
    }

    get items() {
        return this._vm.items;
    }

    getCurrency(type) {
        return Math.floor((this._vm.currencies[type] || 0) * 100) / 100;
    }

    setCurrency(type, value) {
        return this._vm.currencies[type] = value;
    }

    on(event, callback) {
        this._vm.$on(event, callback);
    }

    off(event, callback) {
        this._vm.$off(event, callback);
    }

    clear() {
        this._vm.items = [];
        this._itemsBytemplate.clear();
        this._itemsById.clear();
    }

    load(data) {
        this._vm.items = [];
        this._itemsBytemplate.clear();

        let i = 0;
        const length = data.items.length;
        for (; i < length; i++) {
            let newItem = data.items[i];
            let item = this.getItem(newItem.id) || newItem;
            this._addItem(item);
        }

        this._vm.$set(this._vm, "currencies", data.currencies);
    }

    _indexItemByTemplate(item) {
        let itemsByTemplate = this._getItemsByTemplate(item.template);
        if (!itemsByTemplate || itemsByTemplate.length == 0) {
            this._itemsBytemplate.set(item.template, [item]);
        } else {
            itemsByTemplate.push(item);
        }
    }

    hasItemByTemplate(itemTemplate, quantity) {
        return this.getItemsCountByTemplate(itemTemplate) >= quantity;
    }

    hasItem(itemId, quantity) {
        let item = this.getItem(itemId);
        return item && item.count >= quantity;
    }

    hasItemTemplate(itemTemplate, quantity) {
        return this.getItemsCountByTemplate(itemTemplate) >= quantity;
    }

    hasEnoughIngridient(ingridient, mul = 1) {
        if (ingridient.maxLevelRequired) {
            return this.hasMaxLevelItemByTemplate(
                ingridient.itemId,
                mul
            );
        }

        return this.hasItemByTemplate(ingridient.itemId, ingridient.quantity * mul);
    }

    filterItemsByType(filters, buffer) {
        buffer = buffer || [];
        buffer.length = 0;

        let i = 0;
        const length = this.items.length;

        for (; i < length; ++i) {
            let item = this.items[i];
            let template = item.template;
            const templateData = this._itemDB.getTemplate(template);

            if (templateData.type == ItemType.Consumable) {
                // skip buffs
                if (
                    templateData.action.action == ItemActions.Buff ||
                    templateData.action.action == ItemActions.RaidBuff
                ) {
                    continue;
                }
            }

            if (
                filters[this._itemDB.getItemType(template)] ||
                (templateData.type == ItemType.Equipment &&
                    filters[this._itemDB.getSlot(template)] && !item.equipped)
            ) {
                buffer.push(item);
            }
        }

        return buffer;
    }

    filterItems(filter) {
        return this._vm.items.filter(x => filter(x));
    }

    getItem(itemId) {
        let item = this._itemsById.get(itemId * 1);
        return item ? item : this.emptyItem;
    }

    decreaseStackAndReturn(itemId, count = 1) {
        let item = this.getItem(itemId);
        if (item.count <= count) {
            this._removeItem(itemId);
        } else {
            item.count -= count;
            item = { ...item };
            item.count = 1;
        }

        return item;
    }

    increaseStack(item) {
        let currentItem = this.getItem(item.id);
        if (currentItem) {
            currentItem.count++;
        } else {
            this._addItem(item);
        }
    }

    // returns only first element
    getItemByTemplate(template) {
        let templates = this._getItemsByTemplate(template);
        let item = this._vm.emptyItem;
        if (templates && templates.length > 0) {
            item = templates[0];
        }

        return item;
    }

    getItemsByTemplate(templateId) {
        return this._getItemsByTemplate(templateId);
    }

    // returns reference to the array of items
    _getItemsByTemplate(templateId) {
        return this._itemsBytemplate.get(templateId);
    }

    mergeData(inventoryChanges) {
        let {
            changes,
            delta,
            currencies
        } = inventoryChanges;

        this._vm.$set(this._vm, "currencies", currencies);

        for (let itemId in changes) {
            let changedItem = changes[itemId];
            if (!changedItem) {
                // item was removed
                this._removeItem(itemId);
                continue;
            }

            let item = this.getItem(itemId);
            if (item) {
                // update fields
                item.count = changedItem.count;
                item.equipped = changedItem.equipped;
                item.enchant = changedItem.enchant;
                item.level = changedItem.level;
                item.exp = changedItem.exp;
                item.breakLimit = changedItem.breakLimit;
            } else {
                // add new item
                this._addItem(changedItem);
            }
        }

        this._sort();

        this._vm.$emit(Inventory.Changed, inventoryChanges);
    }

    getItemCount(itemId) {
        let item = this.getItem(itemId);
        return item ? item.count : 0;
    }

    hasMaxLevelItemByTemplate(template, count = 1) {
        let maxLevel = this._itemDB.getMaxLevel(template, 2);
        let items = this._getItemsByTemplate(template);

        if (!items) {
            return false;
        }

        let i = 0;
        let itemsFound = 0;
        const length = items.length;
        for (; i < length; ++i) {
            let item = items[i];
            if (!item.unique) {
                continue;
            }

            if (item.level == maxLevel) {
                itemsFound++;
            }

            if (itemsFound == count) {
                return true;
            }
        }

        return false;
    }

    getItemsCountByTemplate(templateId) {
        const template = this._itemDB.getTemplate(templateId);
        if (template.type == ItemType.Currency) {
            return this.getCurrency(template.currencyType);
        }

        let totalCount = 0;
        let items = this._getItemsByTemplate(templateId);

        if (!items) {
            return 0;
        }

        items.forEach(item => {
            totalCount += item.count;
        });

        return totalCount;
    }

    _removeItem(itemId) {
        itemId = itemId * 1;
        let item = this.getItem(itemId);
        if (!item) {
            return;
        }

        this._itemsById.delete(itemId);

        let items = this._getItemsByTemplate(item.template);
        let index = items.findIndex(x => x.id == itemId);
        if (index != -1) {
            items.splice(index, 1);
        }

        let lastItem = this._vm.items[this._vm.items.length - 1];
        this._vm.items[item.index] = lastItem;
        this._vm.items.pop();
        this._sort();
    }

    _addItem(item) {
        item.index = this._vm.items.push(item) - 1;
        this._itemsById.set(item.id, item);
        this._indexItemByTemplate(item);
        this._sort();

        // notify empty item
        this._vm.emptyItem = {...dummyItem};
    }

    _doSort() {
        this._vm.items.sort((a, b) => {
            let sortingFactorA = this._itemDB.getRarityAsNumber(
                a.template
            );

            let sortingFactorB = this._itemDB.getRarityAsNumber(
                b.template
            );

            if (sortingFactorA == sortingFactorB) {
                sortingFactorA = a.id;
                sortingFactorB = b.id;
            }

            if (sortingFactorA > sortingFactorB) {
                return -1;
            }

            if (sortingFactorA < sortingFactorB) {
                return 1;
            }

            return 0;
        });

        let i = 0;
        const l = this._vm.items.length;
        for (; i < l; ++i) {
            this._vm.items[i].index = i;
        }
    }
}

export default Inventory;

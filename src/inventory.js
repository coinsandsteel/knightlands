import Vue from "vue";

class Inventory {
    constructor(itemDB) {
        this._itemDB = itemDB;
        this._vm = new Vue({
            data: () => ({
                items: [],
                currencies: {}
            })
        });

        // lookup tables
        this._itemsBytemplate = new Map();
        this._itemsById = new Map();
    }

    static get Changed() {
        return "changed";
    }

    get items() {
        return this._vm.items;
    }

    getCurrency(type) {
        return Math.floor((this._vm.currencies[type] || 1) * 100) / 100;
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

    load(data) {
        this._vm.items.length = 0;
        this._itemsBytemplate.clear();
        this._itemsById.clear();
        let i = 0;
        const length = data.items.length;
        for (; i < length; i++) {
            this._addItem(data.items[i]);
        }

        this._vm.$set(this._vm, "currencies", data.currencies);

        this._sort();
    }

    _indexItemByTemplate(item) {
        let itemsByTemplate = this._getItemsByTemplate(item.template);
        if (!itemsByTemplate || itemsByTemplate.length == 0) {
            this._itemsBytemplate.set(item.template, [item]);
        } else {
            itemsByTemplate.push(item);
        }
    }

    hasItem(itemId, quantity) {
        let item = this.getItem(itemId);
        return item && item.count >= quantity;
    }

    hasItemTemplate(itemTemplate, quantity) {
        return this.getItemsCountByTemplate(itemTemplate) >= quantity;
    }

    getItem(itemId) {
        return this._itemsById.get(itemId * 1);
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

    getItemsCountByTemplate(templateId) {
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

        let lastItem = this._vm.items[this._vm.items.length - 1];
        this._vm.items[item.index] = lastItem;
        this._vm.items.pop();
    }

    _addItem(item) {
        item.index = this._vm.items.push(item) - 1;
        this._itemsById.set(item.id, item);
        this._indexItemByTemplate(item);
    }

    _sort() {
        this._vm.items.sort((a, b) => {
            let sortingFactorA = this._itemDB.getRarity(a.template);
            let sortingFactorB = this._itemDB.getRarity(b.template);

            if (sortingFactorA == sortingFactorB) {
                sortingFactorA = a.id;
                sortingFactorB = b.id;
            }

            if (sortingFactorA < sortingFactorB) {
                return -1;
            }

            if (sortingFactorA > sortingFactorB) {
                return 1;
            }

            return 0;
        });
    }
}

export default Inventory;
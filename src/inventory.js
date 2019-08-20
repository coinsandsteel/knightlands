import Vue from "vue";

class Inventory {
    constructor(itemDB) {
        this._itemDB = itemDB;
        this._vm = new Vue({
            data: () => {
                return {
                    items: [],
                    itemsBytemplate: {}
                }
            }
        });

        this._itemsById = new Map();
    }

    static get Changed() {
        return "changed";
    }

    get items() {
        return this._vm.items;
    }

    on(event, callback) {
        this._vm.$on(event, callback);
    }

    off(event, callback) {
        this._vm.$off(event, callback);
    }

    load(inventoryArray) {
        // build and object of it for faster updates in the future
        let i = 0;
        const length = inventoryArray.length;
        for (; i < length; i++) {
            let item = inventoryArray[i];
            this._vm.$set(this._vm.items, item.id, item);
            this._indexItemByTemplate(item);
        }
    }

    _indexItemByTemplate(item) {
        let itemsByTemplate = this.getItemsByTemplate(item.template);
        if (!itemsByTemplate || itemsByTemplate.length == 0) {
            this._vm.$set(this._vm.itemsBytemplate, item.template, [item]);
        } else {
            itemsByTemplate.push(item);
        }
    }

    hasItem(itemId, quantity) {
        let item = this._vm.items[itemId];
        return item && item.count >= quantity;
    }

    hasItemTemplate(itemTemplate, quantity) {
        return this.getItemsCountByTemplate(itemTemplate) >= quantity;
    }

    getItem(itemId) {
        return this._vm.items[itemId];
    }

    // returns reference to the array of items
    getItemsByTemplate(templateId) {
        return this._vm.itemsBytemplate[templateId];
    }

    mergeData(inventoryChanges) {
        let {
            changes,
            delta
        } = inventoryChanges;

        for (let itemId in changes) {
            let changedItem = changes[itemId];
            if (!changedItem) {
                // item was removed
                this._removeItem(itemId);
                continue;
            }

            let item = this._vm.items[itemId];
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

        this._vm.$emit(Inventory.Changed, inventoryChanges);
    }

    getItemCount(itemId) {
        let item = this.getItem(itemId);
        return item ? item.count : 0;
    }

    getItemsCountByTemplate(templateId) {
        let totalCount = 0;
        let items = this.getItemsByTemplate(templateId);

        if (!items) {
            return 0;
        }

        items.forEach(item => {
            totalCount += item.count;
        });

        return totalCount;
    }

    _removeItem(itemId) {
        let itemIndex = this._itemsById.get(itemId);
        if (itemIndex === undefined) {
            return;
        }

        this._itemsById.delete(itemId);

        let item = this._vm.items[itemIndex];
        let lastItem = this._vm.items[this._vm.items.length - 1];
        this._vm.items[itemIndex] = lastItem;
        this._vm.items.pop();

        if (lastItem != item) {
            this._itemsById.set(lastItem.id, itemIndex);
        }
    }

    _addItem(item) {
        this._itemsById.set(item.id, this._vm.items.push(item) - 1);
        this._indexItemByTemplate(item);
    }
}

export default Inventory;
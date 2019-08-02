import Vue from "vue";

class Inventory {
    constructor() {
        this._vm = new Vue({
            data: () => {
                return {
                    items: {},
                    itemsBytemplate: {}
                }
            }
        });
    }

    get items() {
        return this._vm.items;
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
        for (let itemId in inventoryChanges) {
            let changedItem = inventoryChanges[itemId];
            if (!changedItem) {
                // item was removed
                this._vm.$delete(this._vm.items, itemId);
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
                this._vm.$set(this._vm.items, itemId, changedItem);
                this._indexItemByTemplate(item);
            }
        }
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
}

export default Inventory;
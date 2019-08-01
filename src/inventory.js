import Vue from "vue";

class Inventory {
    constructor() {
        this._vm = new Vue({
            data: () => {
                return {
                    items: {}
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
        }
    }

    hasItem(itemId, quanity) {
        let item = this._vm.items[itemId];
        return item && item.count >= quanity;
    }

    getItem(itemId) {
        return this._vm.items[itemId];
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
            }
        }
    }

    getItemCount(itemId) {
        let item = this.getItem(itemId);
        return item ? item.count : 0;
    }
}

export default Inventory;
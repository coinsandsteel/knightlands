<template>
  <div class="tab-content width-100 flex padding-2">
    <BuffSlot
      v-for="record in buffs"
      :key="(record.buff || record.item).template"
      :buff="record.buff"
      :item="record.item"
      @info="handleInfo"
    ></BuffSlot>
  </div>
</template>

<script>
const ItemType = require("@/../knightlands-shared/item_type");
const ItemActions = require("@/../knightlands-shared/item_actions");

import AppSection from "@/AppSection";
import BuffSlot from "./BuffSlot.vue";
import BuffInfo from "./BuffInfo.vue";
import Inventory from "@/inventory";

import { create } from "vue-modal-dialogs";

const ShowBuffInfo = create(BuffInfo, ...BuffInfo.props);

export default {
  mixins: [AppSection],
  components: { BuffSlot },
  data: () => ({
    buffs: []
  }),
  created() {
    this.handleInventoryCallback = this.refreshBuffs.bind(this);
  },
  activated() {
    this.refreshBuffs();
    this.$game.inventory.on(Inventory.Changed, this.handleInventoryCallback);
  },
  deactivated() {
    this.$game.inventory.off(Inventory.Changed, this.handleInventoryCallback);
  },
  methods: {
    refreshBuffs() {
      const buffs = [];
      const activeBuffs = this.$game.character.buffs;
      const activeBuffsHash = {};
      activeBuffs.forEach(buff => {
        activeBuffsHash[buff.template] = buff;
        buffs.push({
          buff
        });
      });

      // exclude consumables with active buff
      let itemsDB = this.$game.itemsDB;

      const items = this.$game.inventory.filterItems(x => {
        if (x.unique) {
          return false;
        }

        if (activeBuffsHash[x.template]) {
          return false;
        }

        const template = itemsDB.getTemplate(x.template);
        if (template.type != ItemType.Consumable || !template.action) {
          return false;
        }

        if (
          template.action.action == ItemActions.Buff ||
          template.action.action == ItemActions.RaidBuff
        ) {
          return true;
        }

        return false;
      });

      let i = 0;
      const length = items.length;
      for (; i < length; ++i) {
        buffs.push({
          item: items[i]
        });
      }

      this.buffs = buffs;
    },
    async handleInfo(buff, item) {
      let use = await ShowBuffInfo(buff, item);
      if (use) {
        if (!item) {
          item = this.$game.inventory.getItemByTemplate(buff.template);
        }

        await this.$game.useItem(item.id);
      }
    }
  }
};
</script>


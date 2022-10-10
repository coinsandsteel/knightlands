<template>
  <div
    class="width-100 buffs-grid padding-2 relative"
    :class="{ 'height-100': buffs.length == 0 }"
  >
    <template v-if="buffs.length > 0">
      <BuffSlot
        v-for="record in buffs"
        :key="(record.buff || record.item).template"
        :buff="record.buff"
        :item="record.item"
        @info="handleInfo"
      ></BuffSlot>
    </template>
    <div
      v-else
      class="flex flex-column flex-center width-100 height-100 absolute-stretch"
    >
      <span class="font-size-22 margin-bottom-2">{{ $t("buffs-empty") }}</span>
      <CustomButton type="yellow" @click="goToShop" minWidth="20rem">{{
        $t("buff-now")
      }}</CustomButton>
    </div>
  </div>
</template>

<script>
const { ItemType } = require("@/../../knightlands-shared/item_type");
const ItemActions = require("@/../../knightlands-shared/item_actions");

import BuffSlot from "./BuffSlot.vue";
import BuffInfo from "./BuffInfo.vue";
import Inventory from "@/inventory";
import ActivityMixin from "@/components/ActivityMixin.vue";
import CustomButton from "@/components/Button.vue";

import { create } from "vue-modal-dialogs";

const ShowBuffInfo = create(BuffInfo, "buff", "item");

export default {
  mixins: [ActivityMixin],
  components: { BuffSlot, CustomButton },
  data: () => ({
    buffs: []
  }),
  created() {
    this._refreshBuffs = this.refreshBuffs.bind(this);
  },
  activated() {
    this.refreshBuffs();
    this.$game.inventory.on(Inventory.Changed, this._refreshBuffs);
  },
  deactivated() {
    this.$game.inventory.off(Inventory.Changed, this._refreshBuffs);
  },
  methods: {
    goToShop() {
      this.$router.push({ name: "daily-shop" });
    },
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

<style lang="less" scoped>
.buffs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(8rem, 1fr));
  grid-template-rows: 1fr;
  justify-items: center;
  row-gap: 0.5rem;
  column-gap: 0.5rem;
}
</style>

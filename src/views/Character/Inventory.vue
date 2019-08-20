<template>
  <div class="tab-content flex flex-column full-flex">
    <div class="equipment-container flex">
      <div class="flex">
        <div class="equipment-container-row flex flex-column flex-center">
          <div v-for="slot in equipmentRow1()" :key="slot" class="equipment-slot">
            <loot
              :item="itemsInSlots[slot]"
              :equipment="true"
              :equipmentSlot="slot"
              @hint="showHint"
            ></loot>
          </div>
        </div>
        <div class="equipment-container-row flex flex-column flex-center flex-space-between">
          <div v-for="slot in equipmentRow2()" :key="slot" class="equipment-slot">
            <loot
              :item="itemsInSlots[slot]"
              :equipment="true"
              :equipmentSlot="slot"
              @hint="showHint"
            ></loot>
          </div>
        </div>
        <div class="equipment-container-row flex flex-column flex-center">
          <div v-for="slot in equipmentRow3()" :key="slot" class="equipment-slot">
            <loot
              :item="itemsInSlots[slot]"
              :equipment="true"
              :equipmentSlot="slot"
              @hint="showHint"
            ></loot>
          </div>
        </div>
      </div>
      <div class="flex flex-no-wrap flex-space-around font-size-20">
        <div
          class="flex flex-no-wrap flex-column flex-space-evenly flex-start flex-basis-50 text-align-left"
        >
          <span v-for="stat in stats" :key="stat" class>{{stat}}</span>
        </div>
        <div
          class="flex flex-no-wrap flex-column flex-space-evenly flex-start flex-basis-50 text-align-left"
        >
          <span v-for="stat in stats" :key="stat" class="attribute">{{$character.getStat(stat)}}</span>
        </div>
      </div>
    </div>
    <div class="flex full-flex dummy-height">
      <div v-bar class="width-100">
        <loot-container :items="filteredItems" :inventory="true" @hint="showHint"></loot-container>
      </div>
    </div>
  </div>
</template>

<script>
import Loot from "@/components/Loot.vue";
import LootHint from "@/components/LootHint.vue";
import ItemFilterComponent from "@/components/ItemFilter.vue";
import LootContainer from "@/components/LootContainer.vue";
import { create as CreateDialog } from "vue-modal-dialogs";
import AppSection from "@/AppSection";
import CustomButton from "@/components/Button.vue";
import {
  EquipmentSlots,
  getSlot
} from "@/../knightlands-shared/equipment_slot";
import ItemType from "@/../knightlands-shared/item_type";
import EquipmentType from "@/../knightlands-shared/equipment_type";
import CharacterStats from "@/../knightlands-shared/character_stat.js";

const Hint = CreateDialog(LootHint, "item", "equip", "unequip", "actions");
const ItemFilter = CreateDialog(ItemFilterComponent);

export default {
  mixins: [AppSection],
  components: {
    Loot,
    LootContainer
  },
  props: {
    items: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      filteredItems: [],
      slots: {},
      itemsInSlots: this.$character.equipment,
      stats: CharacterStats
    };
  },
  watch: {
    items() {
      this.updateItems();
    }
  },
  mounted() {
    this.updateItems();
  },
  activated() {
    this.addFooter(CustomButton, {
      cb: this.showItemFilter.bind(this),
      caption: "Filter",
      type: "grey"
    });
  },
  deactivated() {
    this.removeFooter();
  },
  methods: {
    updateItems() {
      this.filterItems(this.$store.getters.itemFilters);
    },
    async showHint(item) {
      if (!item) {
        return;
      }

      let action = await Hint(item, !item.equipped, item.equipped);
      let itemsDB = this.$game.itemsDB;
      let itemSlot = itemsDB.getSlot(item.template);

      if (action == "equip") {
        await this.$game.equipItem(item.id);
      } else if (action == "unequip") {
        await this.$game.unequipItem(itemSlot);
      }
    },
    async showItemFilter() {
      let filters = await ItemFilter();
      if (filters) {
        this.$store.commit("setItemFilters", filters);
        this.filterItems(filters);
      }
    },
    filterItems(filters) {
      let itemsDB = this.$game.itemsDB;
      this.filteredItems.length = 0;

      for (let i in this.items) {
        let item = this.items[i];
        let template = item.template;
        if (
          filters[itemsDB.getItemType(template)] ||
          filters[itemsDB.getSlot(template)]
        ) {
          this.filteredItems.push(item);
        }
      }
    },
    equipmentRow1() {
      return [
        EquipmentSlots.Necklace,
        EquipmentSlots.Ring,
        EquipmentSlots.Pet,
        EquipmentSlots.MainHand
      ];
    },
    equipmentRow2() {
      return [EquipmentSlots.Helmet, EquipmentSlots.OffHand];
    },
    equipmentRow3() {
      return [
        EquipmentSlots.Chest,
        EquipmentSlots.Cape,
        EquipmentSlots.Gloves,
        EquipmentSlots.Boots
      ];
    }
  }
};
</script>


<style lang="less" scoped>
@import "./style.less";
@import (reference) "./../../style/common.less";

.attribute {
  margin-left: 1rem;
}
</style>
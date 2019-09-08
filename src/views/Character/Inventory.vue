<template>
  <Promised class="tab-content dummy-height flex flex-column full-flex" :promise="request">
    <template v-slot:combined="{isPending, isDelayOver}">
      <loading-screen :loading="true" v-show="isDelayOver && isPending"></loading-screen>

      <div class="tab-content dummy-height flex flex-column full-flex">
        <div class="equipment-container flex">
          <div class="flex">

            <div class="equipment-container-row flex flex-column flex-center">
              <div v-for="slot in equipmentRow1()" :key="slot" class="equipment-slot">
                <loot
                  :item="itemsInSlots[slot]"
                  :equipment="true"
                  :equipmentSlot="slot"
                  @hint="showEquipmentHint"
                ></loot>
              </div>
            </div>

            <div class="equipment-container-row flex flex-column flex-center flex-space-between">
              <div v-for="slot in equipmentRow2()" :key="slot" class="equipment-slot">
                <loot
                  :item="itemsInSlots[slot]"
                  :equipment="true"
                  :equipmentSlot="slot"
                  @hint="showEquipmentHint"
                ></loot>
              </div>
            </div>

            <div class="equipment-container-row flex flex-column flex-center">
              <div v-for="slot in equipmentRow3()" :key="slot" class="equipment-slot">
                <loot
                  :item="itemsInSlots[slot]"
                  :equipment="true"
                  :equipmentSlot="slot"
                  @hint="showEquipmentHint"
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
          <div v-bar class="width-100 height-100 dummy-height">
            <loot-container :items="filteredItems" :inventory="true" @hint="showHint"></loot-container>
          </div>
        </div>

        <div v-show="showHintItems">
          <transition>

            <div class="items-bg-mask flex flex-center" @click.self="showHintItems = false">
              <transition>
                <Hooper ref="hooper" style="height: 100%" :infiniteScroll="true" @slide="updateHintItems">
                  <slide v-for="(item, index) in hintItems" :key="index">
                    <LootHint :item="item.item" :equip="!item.equipped" :unequip="item.equipped" :hideMask="true" @close="handleItemAction"></LootHint>
                  </slide>
                </Hooper>
              </transition>
            </div>

          </transition>
        </div>
      </div>
    </template>
  </Promised>
</template>

<script>
import { Hooper, Slide } from 'hooper';
import 'hooper/dist/hooper.css';

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
import ItemInfo from "@/components/ItemInfo.vue"
import { Promised } from "vue-promised";
import LoadingScreen from "@/components/LoadingScreen.vue"

const Hint = CreateDialog(LootHint, "item", "equip", "unequip", "actions");
const ItemFilter = CreateDialog(ItemFilterComponent);

export default {
  mixins: [AppSection],
  components: {
    Loot,
    LootContainer,
    LootHint,
    Hooper, 
    Slide,
    ItemInfo,
    Promised,
    LoadingScreen
  },
  props: {
    items: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      filteredItems: [],
      slots: {},
      itemsInSlots: this.$character.equipment,
      stats: CharacterStats,
      hintItems: [],
      showHintItems: false,
      currentSlideIndex: 0,
      request: null
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
    updateHintItems(index) {
      let currentSlide = this.currentSlideIndex;
      let maxSlideIndex = (this.filteredItems.length < 3 ? this.filteredItems.length : 3) - 1;
      let direction = 1;
      let cs = index.currentSlide;
      let fs = index.slideFrom;

      if (typeof index == "object") {
        currentSlide = index.currentSlide;

        if (currentSlide < 0) {
          currentSlide = maxSlideIndex;
        } else if (currentSlide > maxSlideIndex) {
          currentSlide = 0;
          direction = -1;
        }

        // get item by slide
        if (this.hintItems.length <= currentSlide) {
          index = 0;
        } else {
          index = this.hintItems[currentSlide].index;
        }
      }

      this.currentSlideIndex = currentSlide;

      this.hintItems.length = 3;

      for (let i = -1; i < maxSlideIndex; ++i) {
        // find correct indicies for items to place
        let offsetSlideIndex = currentSlide + i;
        if (offsetSlideIndex < 0) {
          offsetSlideIndex = maxSlideIndex;
        } else if (offsetSlideIndex > maxSlideIndex) {
          offsetSlideIndex = 0;
        }

        // find index of corresponding item
        let hintItemIndex = index + i;
        if (hintItemIndex < 0) {
          hintItemIndex = this.filteredItems.length - 1;
        } else if (hintItemIndex == this.filteredItems.length) {
          hintItemIndex = 0;
        }

        this.$set(this.hintItems, offsetSlideIndex, {
          item: this.filteredItems[hintItemIndex],
          index: hintItemIndex,
          slide: offsetSlideIndex
        });
      }
    },
    async showEquipmentHint(item) {
      if (!item) {
        return;
      }

      let action = await Hint(item, !item.equipped, item.equipped);
      await this.handleItemAction(item, action);
    },
    async handleItemAction(item, action) {
      this.showHintItems = false;

      let itemSlot = this.$game.itemsDB.getSlot(item.template);

      if (action == "equip") {
        this.request = this.$game.equipItem(item.id);
      } else if (action == "unequip") {
        this.request = this.$game.unequipItem(itemSlot);
      }
    },
    showHint(item, index) {
      if (!item) {
        return;
      }

      this.updateHintItems(index);

      this.showHintItems = true;

      this.$nextTick(()=>{
        this.$refs.hooper.update();
      });
    },
    async showItemFilter() {
      let filters = await ItemFilter();
      if (filters) {
        this.filterItems(filters);
      }
    },
    filterItems(filters) {
      let itemsDB = this.$game.itemsDB;
      this.filteredItems.length = 0;

      let i = 0;
      const length = this.items.length;

      for (; i < length; ++i) {
        let item = this.items[i];
        let template = item.template;
        if (
          filters[itemsDB.getItemType(template)] ||
          (itemsDB.getTemplate(template).type == ItemType.Equipment &&
            filters[itemsDB.getSlot(template)])
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

.items-bg-mask {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.616);
  z-index: 900;
}
</style>